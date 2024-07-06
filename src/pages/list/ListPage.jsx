import React, { useState, useEffect } from 'react';

import { realtimeDb } from '../../firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';


export default function ListPage() {
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
        <div>
            <div className='flex flex-col-reverse m-2 mb-[70px]'>
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
    )
}
