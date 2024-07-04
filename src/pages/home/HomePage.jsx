import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { realtimeDb } from '../../firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const customBarPlugin = {
    id: 'customBarPlugin',
    beforeDraw: (chart) => {
        const { ctx, data, chartArea: { top, bottom }, scales: { x, y } } = chart;
        ctx.save();
        data.datasets.forEach((dataset, datasetIndex) => {
            chart.getDatasetMeta(datasetIndex).data.forEach((bar, index) => {
                const { x: barX, y: barY, width: barWidth, height: barHeight } = bar;

                const radius = Math.min(10, barWidth / 2, barHeight / 2);
                const left = barX - barWidth / 2;
                const right = barX + barWidth / 2;
                const top = barY;
                const bottom = barY + barHeight;

                ctx.beginPath();
                ctx.moveTo(left + radius, top);
                ctx.lineTo(right - radius, top);
                ctx.quadraticCurveTo(right, top, right, top + radius);
                ctx.lineTo(right, bottom);
                ctx.lineTo(left, bottom);
                ctx.lineTo(left, top + radius);
                ctx.quadraticCurveTo(left, top, left + radius, top);
                ctx.closePath();
                ctx.fillStyle = dataset.backgroundColor;
                ctx.fill();
                ctx.strokeStyle = dataset.borderColor;
                ctx.stroke();
            });
        });
        ctx.restore();
    },
};

export default function HomePage() {
    const [items, setItems] = useState([]);
    const userID = localStorage.getItem('id');

    useEffect(() => {
        const itemsRef = ref(realtimeDb, 'items');
        const userItemsQuery = query(itemsRef, orderByChild('userid'), equalTo(userID));

        const unsubscribe = onValue(userItemsQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itemsList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setItems(itemsList);
            } else {
                setItems([]);
            }
        });

        return () => unsubscribe();
    }, [userID]);

    useEffect(() => {
        // Calculate expenses by day of the week
        const expensesByDay = [0, 0, 0, 0, 0, 0, 0]; // Initialize array for each day of the week

        items.forEach(item => {
            // Calculate total expense for the item
            const totalExpense = item.items.reduce((acc, thing) => acc + Number(thing.amount), 0);

            // Get day of the week (0-6, where 0 is Sunday)
            const dayOfWeek = new Date(item.dateTime.year, item.dateTime.month - 1, item.dateTime.day).getDay();

            // Add total expense to the corresponding day in the array
            expensesByDay[(dayOfWeek + 6) % 7] += totalExpense; // Adjusting so 0 (Sunday) maps to the last index
        });

        // Update chart data
        setChartData(prevChartData => ({
            ...prevChartData,
            datasets: [{
                ...prevChartData.datasets[0],
                data: expensesByDay,
            }]
        }));
    }, [items]);

    const [chartData, setChartData] = useState({
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [
            {
                label: 'Расходы',
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderRadius: 10,
                data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros for each day of the week
            },
        ],
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            customBarPlugin,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Еженедельные расходы',
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y} СОМ`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const groupedItems = items.reduce((acc, item) => {
        const dateKey = `${item.dateTime.day}-${item.dateTime.month}-${item.dateTime.year}`;
        if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, totalAmount: 0, items: [] };
        }
        const totalAmountForItem = item.items.reduce((sum, thing) => sum + Number(thing.amount), 0);
        acc[dateKey].totalAmount += totalAmountForItem;
        acc[dateKey].items.push(...item.items);
        return acc;
    }, {});

    const sortedGroupedItems = Object.values(groupedItems).sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('-').map(Number);
        const [dayB, monthB, yearB] = b.date.split('-').map(Number);
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    return (
        <>
            <div className='mx-auto'>
                <div className='h-[250px] bg-black rounded-b-[24px] flex items-center justify-center'>
                    <div className='w-full h-full p-2'>
                        <Bar data={chartData} options={options} width={400} height={400} />
                    </div>
                </div>
                <div className='flex flex-col m-2 mb-[70px]'>
                    {sortedGroupedItems.length > 0 ? (
                        <>
                            {sortedGroupedItems.map(item => (
                                <div key={item.date} className='flex flex-col'>
                                    <span className='text-center bold'>{item.date}</span>
                                    <div>
                                        <div className='flex justify-between border-b-2'>
                                            <span>Продукт</span>
                                            <span>Сумма</span>
                                        </div>
                                        {item.items.map((thing, index) => (
                                            <div key={index} className='flex justify-between'>
                                                <span className='text-lg'>{thing.thing}</span>
                                                <span className='font-medium text-sm'>- {thing.amount} СОМ</span>
                                            </div>
                                        ))}
                                        <div className='flex justify-between border-t-2 mt-2'>
                                            <span className='text-lg'>Итого:</span>
                                            <span className='font-medium text-sm'>- {item.totalAmount} СОМ</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>Записей нет</p>
                    )}
                </div>
            </div>
        </>
    );
}
