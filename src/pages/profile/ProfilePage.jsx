import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase';

import logOut from '../../assets/image/logout.svg'

export default function ProfilePage() {
    const [userCheck, setUserCheck] = useState(false);  // Инициализируем состояние с false

    const [userData, setUserData] = useState([])

    const user = localStorage.getItem('id');  // Правильное использование localStorage.getItem

    const navigate = useNavigate()

    const getUserData = async (user) => {
        try {
            const userDocRef = doc(db, 'users', user);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setUserData(userData);
                console.log(userData);
                return userData;
            } else {
                // Документ не найден
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            throw error;
        }
    };


    useEffect(() => {
        if (user) {
            setUserCheck(true);
            getUserData(user)
        } else {
            setUserCheck(false);
        }
    }, [user]);

    const handleBtnLogOut = () => {
        localStorage.clear()
        navigate('/profile')
    }

    return (
        <>
            {userCheck ?
                <div className='p-5 flex flex-col justify-between h-[90vh]'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='text-2xl underline'>Имя</h1>
                        <span className='text-6xl'>{userData.name}</span>
                    </div>
                    <button onClick={handleBtnLogOut} className='bg-black text-white flex justify-center items-center gap-1 py-1 px-3  rounded-2xl'>
                        Выйти
                        <img className='w-7 h-7' src={logOut} alt='logOut' />
                    </button>
                </div>
                :
                <div className='flex mt-[250px]'>
                    <div className='flex-auto flex justify-center items-center flex-col gap-4'>
                        <h1>Вы не вошли :)</h1>
                        <Link to='/login' className='px-4 py-3 bg-black text-white font-[18px] rounded-2xl'>Войти</Link>
                    </div>
                </div>
            }
        </>
    );
}
