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

    // Group items by date
    const groupedItems = items.reduce((acc, item) => {
        const dateKey = `${item.dateTime.day}-${item.dateTime.month}-${item.dateTime.year}`;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {});

    // Prepare data for chart
    const chartData = {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros for each day of the week
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderRadius: 10,
            },
        ],
    };

    // Populate chart data with grouped items
    Object.keys(groupedItems).forEach(dateKey => {
        const dayOfWeek = new Date(groupedItems[dateKey][0].dateTime.year, groupedItems[dateKey][0].dateTime.month - 1, groupedItems[dateKey][0].dateTime.day).getDay();
        const dataIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        chartData.datasets[0].data[dataIndex] += groupedItems[dateKey].length;
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


    return (
        <>
            <div className='mx-auto'>
                <div className='h-[250px] bg-black rounded-b-[24px] flex items-center justify-center'>
                    <div className='w-full h-full p-2'>
                        <Bar data={chartData} options={options} width={400} height={400} />
                    </div>
                </div>
                <div className='flex flex-col m-2 mb-[70px] overflow-scroll'>
                    {items.length > 0 ? (
                        <>
                            {Object.keys(groupedItems).map(dateKey => (
                                <div key={dateKey} className='flex flex-col overflow-scroll'>
                                    <span className='text-center bold'>
                                        {dateKey}
                                    </span>
                                    <div>
                                        <div className='flex justify-between border-b-2'>
                                            <span>Прдемет</span>
                                            <span>Сумма</span>
                                        </div>
                                        <div className='overflow-scroll h-[270px]'>
                                            {groupedItems[dateKey].map(item => (
                                                <div key={item.id}>
                                                    {item.items.map((thing, index) => (
                                                        <div className='flex justify-between' key={index}>
                                                            <span className='text-lg'>{thing.thing}</span>
                                                            <span className='font-medium text-sm'>- {thing.amount} СОМ</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
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
