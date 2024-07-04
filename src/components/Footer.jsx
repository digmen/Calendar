import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import homeImg from '../assets/image/home.svg';
import profileImg from '../assets/image/profile.svg';
import addImg from '../assets/image/addimg.svg';
import closeImg from '../assets/image/closeimg.svg';

import { realtimeDb } from '../firebase';
import { ref, push } from "firebase/database";

export default function Footer() {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [inputs, setInputs] = useState([{ thing: '', amount: '' }]);
    const [message, setMessage] = useState('');
    const userID = localStorage.getItem('id');

    const handleOpenModal = (value) => {
        console.log(value);
        if (location.pathname !== '/') {
            navigate('/');
        }
        setMessage('');
        setModal(true);
    };

    const handleAddInput = () => {
        setInputs([...inputs, { thing: '', amount: '' }]);
    };

    const handleInputChange = (index, event) => {
        const newInputs = inputs.slice();
        newInputs[index][event.target.name] = event.target.value;
        setInputs(newInputs);
        console.log(newInputs);
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

            setModal(false);
            setInputs([{ thing: '', amount: '' }]);
            navigate('/');
        } catch (error) {
            console.log(inputs);
            console.error('Error adding document: ', error);
        }
    };

    return (
        <>
            {modal &&
                <div className='h-full w-full  bg-[#00000099] absolute top-[0px]'>
                    <div className='p-3 w-[330px] h-[450px] mt-[50px] mx-auto bg-white border-[2px] border-[#313131] rounded-xl'>
                        <div className='flex justify-end'>
                            <button onClick={() => setModal(false)}>
                                <img className='w-[35px] h-[35px]' src={closeImg} alt='closeImg' />
                            </button>
                        </div>
                        <div className='flex justify-between mt-4'>
                            <span >Вещь</span>
                            <span >Сумма</span>
                        </div>
                        <div className='flex flex-col justify-between'>
                            <div className='mt-3'>
                                <form className='flex flex-col gap-4  h-[280px] overflow-auto '>
                                    {inputs.map((input, index) => (
                                        <div key={index} className='flex justify-between'>
                                            <input
                                                name='thing'
                                                value={input.thing}
                                                onChange={(e) => handleInputChange(index, e)}
                                                placeholder='Текст'
                                                className='flex max-w-[250px] border-gray-400 rounded-lg border-[1px] p-1 pl-2 transition shadow-inner focus:bg-black ease-in-out duration-500 focus:text-white focus:duration-500 focus:transition'
                                            />
                                            <input
                                                name='amount'
                                                value={input.amount}
                                                onChange={(e) => handleInputChange(index, e)}
                                                placeholder='Текст'
                                                className='max-w-[80px] border-gray-400 rounded-lg border-[1px] p-1 pl-2 transition shadow-inner focus:bg-black ease-in-out duration-500 focus:text-white focus:duration-500 focus:transition'
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type='button'
                                        onClick={handleAddInput}
                                        className='bg-black text-white px-4 py-2 rounded-2xl active:bg-white active:text-black active:transition ease-in-out transition focus:duration-1000 duration-1000'
                                    >
                                        Добавить еще поле +
                                    </button>
                                </form>
                            </div>
                            <div className='flex justify-end mt-5'>
                                <button
                                    type='button'
                                    onClick={handleSubmit}
                                    className='active:bg-black active:transition ease-in-out transition focus:duration-1000 duration-1000 border-[2px] active:text-white text-black  px-4 py-2 rounded-2xl'
                                >
                                    Добавить
                                </button>
                            </div>
                        </div>
                    </div>
                    {message ?
                        <div className='min-h-[50px] w-[330px] mx-auto mt-5 text-red-600 bg-white border-[2px] p-3 border-black rounded-xl'>
                            {<span>{message}</span>}
                        </div>
                        :
                        ''
                    }
                </div>
            }
            <div className='h-[70px] w-full fixed bottom-[-10px]'>
                <div className='flex  justify-center w-[100%] '>
                    <div className='bg-[#000000] flex gap-[50px] items-center justify-center px-[20px] py-2   rounded-[40px] '>
                        <div className='w-9 h-9 flex justify-center items-center'>
                            <Link to='/' className='flex justify-center items-center'>
                                <img src={homeImg} alt='homeImg' />
                            </Link>
                        </div>
                        <div className='w-9 h-9 flex justify-center items-center'>
                            <button onClick={() => handleOpenModal()} className='flex justify-center items-center'>
                                <img src={addImg} alt='profileImg' />
                            </button>
                        </div>
                        <div className='w-9 h-9 flex justify-center items-center'>
                            <Link to='/profile' className='flex justify-center items-center'>
                                <img src={profileImg} alt='profileImg' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
