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
    const [filter, setFilter] = useState('day');
    const [totalExpense, setTotalExpense] = useState(0);
    const [chartData, setChartData] = useState({
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [
            {
                label: 'Расходы',
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderRadius: 10,
                data: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
    });
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

    const filterData = (items, filter) => {
        switch (filter) {
            case 'year':
                return filterByYear(items);
            case 'month':
                return filterByMonth(items);
            case 'week':
                return filterByWeek(items);
            case 'day':
            default:
                return filterByDay(items);
        }
    };

    const filterByYear = (items) => {
        const expensesByYear = {};

        items.forEach(item => {
            const year = item.dateTime.year;
            const totalExpense = item.items.reduce((acc, thing) => acc + Number(thing.amount), 0);

            if (!expensesByYear[year]) {
                expensesByYear[year] = 0;
            }
            expensesByYear[year] += totalExpense;
        });

        const labels = Object.keys(expensesByYear);
        const data = Object.values(expensesByYear);

        return { labels, data };
    };

    const filterByMonth = (items) => {
        const expensesByMonth = {};

        items.forEach(item => {
            const month = `${item.dateTime.year}-${item.dateTime.month}`;
            const totalExpense = item.items.reduce((acc, thing) => acc + Number(thing.amount), 0);

            if (!expensesByMonth[month]) {
                expensesByMonth[month] = 0;
            }
            expensesByMonth[month] += totalExpense;
        });

        const labels = Object.keys(expensesByMonth);
        const data = Object.values(expensesByMonth);

        return { labels, data };
    };

    const filterByWeek = (items) => {
        const expensesByWeek = {};

        items.forEach(item => {
            const year = item.dateTime.year;
            const month = item.dateTime.month - 1;
            const day = item.dateTime.day;
            const currentDate = new Date(year, month, day);
            const weekNumber = getWeekNumber(currentDate);

            const totalExpense = item.items.reduce((acc, thing) => acc + Number(thing.amount), 0);

            if (!expensesByWeek[weekNumber]) {
                expensesByWeek[weekNumber] = 0;
            }
            expensesByWeek[weekNumber] += totalExpense;
        });

        const labels = Object.keys(expensesByWeek);
        const data = Object.values(expensesByWeek);

        return { labels, data };
    };

    const filterByDay = (items) => {
        const expensesByDay = [0, 0, 0, 0, 0, 0, 0];

        items.forEach(item => {
            const totalExpense = item.items.reduce((acc, thing) => acc + Number(thing.amount), 0);
            const dayOfWeek = new Date(item.dateTime.year, item.dateTime.month - 1, item.dateTime.day).getDay();
            expensesByDay[(dayOfWeek + 6) % 7] += totalExpense;
        });

        const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        return { labels, data: expensesByDay };
    };

    const getWeekNumber = (d) => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    useEffect(() => {
        const filteredData = filterData(items, filter);
        setChartData({
            labels: filteredData.labels,
            datasets: [{
                label: 'Расходы',
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderRadius: 10,
                data: filteredData.data,
            }]
        });

        const total = filteredData.data.reduce((acc, expense) => acc + expense, 0);
        setTotalExpense(total);
    }, [items, filter]);

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
                text: filter === 'year' ? 'Годовые расходы' :
                    filter === 'month' ? 'Месячные расходы' :
                        filter === 'week' ? 'Недельные расходы' :
                            'Дневные расходы',
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
            </div>
            <div className='flex justify-center mt-4'>
                <button onClick={() => setFilter('day')} className='mx-2 px-4 py-2 bg-black text-white rounded'>День</button>
                <button onClick={() => setFilter('week')} className='mx-2 px-4 py-2 bg-black text-white rounded'>Неделя</button>
                <button onClick={() => setFilter('month')} className='mx-2 px-4 py-2 bg-black text-white rounded'>Месяц</button>
                <button onClick={() => setFilter('year')} className='mx-2 px-4 py-2 bg-black text-white rounded'>Год</button>
            </div>
            <div className='flex justify-center mt-4'>
                <span className=''>Общая сумма расходов: {totalExpense} СОМ</span>
            </div>
        </>
    );
}
