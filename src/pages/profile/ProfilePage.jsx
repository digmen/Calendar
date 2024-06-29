import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase';

export default function ProfilePage() {
    const [userCheck, setUserCheck] = useState(false);  // Инициализируем состояние с false

    const [userData, setUserData] = useState([])

    const user = localStorage.getItem('id');  // Правильное использование localStorage.getItem

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

    return (
        <>
            {userCheck ?
                <div className='p-5'>
                    <div className='flex flex-col'>
                        <span>Ваше имя : {userData.name}</span>
                    </div>
                </div>
                :
                <div className='flex h-[100vh]'>
                    <div className='flex-auto flex justify-center items-center flex-col gap-4'>
                        <h1>Вы не вошли :)</h1>
                        <Link to='/login' className='px-4 py-3 bg-black text-white font-[18px] rounded-2xl'>Войти</Link>
                    </div>
                </div>
            }
        </>
    );
}
