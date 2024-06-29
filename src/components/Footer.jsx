import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import homeImg from '../assets/image/home.svg'
import profileImg from '../assets/image/profile.svg'
import addImg from '../assets/image/addimg.svg'

import closeImg from '../assets/image/closeimg.svg'


export default function Footer() {

    const [modal, setModal] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();

    // Функция которая напрвляет на домашнию страницу если нажать на кнопку добавить запись если он не 
    // находиться на главной странице 
    const handleOpenModal = (value) => {
        console.log(value);
        if (location.pathname != '/') {
            navigate('/')
        }
        setModal(true)
    }





    return (
        <>
            {modal &&
                <div className='h-[100%] w-full  absolute top-[-10px]'>
                    <div className='p-5 w-[330px] h-[400px] mt-[50px] mx-auto bg-white border rounded-2xl'>
                        <div className='flex justify-end'>
                            <button onClick={() => setModal(false)} className='border-black rounded-full border-[2px]'>
                                <img className='w-[35px] h-[35px]' src={closeImg} alt='closeImg' />
                            </button>
                        </div>
                        <div className='flex justify-between mt-4'>
                            <span >Вещь</span>
                            <span >Сумма</span>
                        </div>
                        <div>
                            <div className='mt-3'>
                                <form className='flex flex-col gap-4 h-[200px] overflow-auto'>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <input placeholder='Текст' className='max-w-[200px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                        <input placeholder='Текст' className='max-w-[65px] border-black rounded-lg border-[1px] p-1 pl-3' />
                                    </div>

                                </form>
                            </div>
                            <div className='flex justify-center mt-5'>
                                <button className='bg-black text-white px-4 py-2 rounded-2xl'>Добавить +</button>
                            </div>

                            <button></button>
                        </div>
                    </div>
                </div>
            }
            <div className='h-[70px] w-full fixed bottom-0 '>
                <div className='flex  justify-center w-[100%] '>
                    <div className='bg-[#000000] border  flex gap-[50px] items-center justify-center px-[20px] py-2 rounded-[40px] '>
                        <div className='w-7 h-7'>
                            <Link to='/'>
                                <img className='w-7 h-7' src={homeImg} alt='homeImg' />
                            </Link>
                        </div>
                        <div className='w-7 h-7'>
                            <button onClick={() => handleOpenModal('1')}>
                                <img className='w-7 h-7' src={addImg} alt='profileImg' />
                            </button>
                        </div>
                        <div className='w-7 h-7'>
                            <Link to='/profile'>
                                <img className='w-7 h-7' src={profileImg} alt='profileImg' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
