import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { realtimeDb } from '../../firebase';
import { ref, push } from "firebase/database";

import closeImg from '../../assets/image/closeimg.svg';

export default function AddListPage() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([{ thing: '', amount: '' }]);
    const [message, setMessage] = useState('');
    const userID = localStorage.getItem('id');

    const lastInputRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    const handleAddInput = () => {
        if (inputs.length < 6) {
            setInputs([...inputs, { thing: '', amount: '' }]);
            setShouldScroll(true);
        }
    };

    useEffect(() => {
        if (shouldScroll && lastInputRef.current) {
            lastInputRef.current.scrollIntoView({ behavior: 'smooth' });
            setShouldScroll(false);
        }
    }, [inputs, shouldScroll]);

    const handleRemoveInput = (index) => {
        const newInputs = inputs.slice();
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    const handleInputChange = (index, event) => {
        const newInputs = inputs.slice();
        newInputs[index][event.target.name] = event.target.value;
        setInputs(newInputs);
    };

    const handleSubmit = async () => {
        try {
            const hasEmptyFields = inputs.some(input => !input.thing || !input.amount);

            if (hasEmptyFields) {
                setMessage('Заполните все поля прежде чем добавить запись');
                return;
            }

            const currentDate = new Date();
            const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
            const dayOfWeek = daysOfWeek[currentDate.getDay()];

            const dateTime = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1, // месяцы начинаются с 0
                day: currentDate.getDate(),
                hours: currentDate.getHours(),
                dayOfWeek: dayOfWeek,
            };

            const itemsRef = ref(realtimeDb, 'items');
            await push(itemsRef, {
                items: inputs,
                userid: userID,
                dateTime: dateTime
            });

            setInputs([{ thing: '', amount: '' }]);
            navigate('/');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <div>
            <div className='p-3 flex justify-end'>
                <Link to='/'>
                    <img className='w-[35px] h-[35px]' src={closeImg} alt='closeImg' />
                </Link>
            </div>
            <div className='px-3'>
                <div className='min-h-[30px] w-[330px] mx-auto m-1 py-1'>
                    {message ?
                        <div className='flex justify-center bg-white border-[1px] border-black rounded-md'>
                            <span className='text-[12px] text-red-600'>{message}</span>
                        </div>
                        :
                        ''
                    }
                </div>
                <div className='flex justify-between'>
                    <span>Вещь</span>
                    <span>Сумма</span>
                </div>
                <div className='flex flex-col justify-between'>
                    <div className='mt-3 h-[300px] overflow-y-scroll'>
                        <form className='flex flex-col gap-4 overflow-auto'>
                            {inputs.map((input, index) => (
                                <div key={index} className='flex justify-between items-center'>
                                    <input
                                        name='thing'
                                        value={input.thing}
                                        onChange={(e) => handleInputChange(index, e)}
                                        placeholder='Вещь'
                                        className='flex max-w-[200px] border-gray-400 rounded-lg border-[1px] p-1 pl-2 transition shadow-inner focus:bg-black ease-in-out duration-500 focus:text-white focus:duration-500 focus:transition'
                                        ref={index === inputs.length - 1 ? lastInputRef : null}
                                    />
                                    <input
                                        name='amount'
                                        value={input.amount}
                                        onChange={(e) => handleInputChange(index, e)}
                                        placeholder='СОМ'
                                        className='max-w-[80px] border-gray-400 rounded-lg border-[1px] p-1 pl-2 transition shadow-inner focus:bg-black ease-in-out duration-500 focus:text-white focus:duration-500 focus:transition'
                                    />
                                    <button type='button' onClick={() => handleRemoveInput(index)} className='text-red-600 text-2xl'>
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {inputs.length < 6 && (
                                <button
                                    type='button'
                                    onClick={handleAddInput}
                                    className='bg-black text-white px-4 py-2 rounded-2xl'
                                >
                                    Добавить еще поле +
                                </button>
                            )}
                        </form>
                    </div>
                    <div className='flex justify-end mt-3 '>
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='active:bg-black active:transition ease-in-out transition focus:duration-1000 duration-1000 border-[2px] active:text-white text-black px-4 py-2 rounded-2xl'
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
