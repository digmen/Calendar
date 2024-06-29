import React, { useState } from 'react';
import eaysYes from '../../assets/image/eaysyes.svg'
import eaysNo from '../../assets/image/eaysno.svg'

import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import bcrypt from 'bcryptjs';
import { db } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [hideShowPass, setHideShowPass] = useState(false)
    const [hideShowPassRepeat, setHideShowPassRepeat] = useState(false)

    const [errorSignUp, setErrorSignUp] = useState('')

    const navigate = useNavigate()

    const hideShowPassword = () => {
        setHideShowPass(!hideShowPass)
    }
    const hideShowPasswordRepeat = () => {
        setHideShowPassRepeat(!hideShowPassRepeat)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Проверка, существует ли уже пользователь с данным именем
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("name", "==", userName));
            const querySnapshot = await getDocs(q);

            if (userName.length == 0 || password == 0 || passwordRepeat == 0) {
                setErrorSignUp("Заполните все поля");
                console.log("Заполните все поля")
                return
            }

            if (!querySnapshot.empty) {
                setErrorSignUp("Пользователь уже существует");
                console.log("пользователь уже существует")
                return
            }

            if (password !== passwordRepeat) {
                setErrorSignUp("Пароли не совпадают");
                console.log("пароли не совпадают");
                return
            }

            if (password.length < 6) {
                setErrorSignUp("Пароль не меньше 6");
                console.log("Пароль меньше 6");
                console.log(password);
                return
            }


            if (querySnapshot.empty === false) {
                setErrorSignUp('Пользователь уже существует');
                return
            } else {
                // Генерация уникального идентификатора
                const userId = uuidv4();

                // Хэширование пароля
                const hashedPassword = await bcrypt.hash(password, 10);

                // Создание пользователя с уникальным идентификатором
                await setDoc(doc(usersRef, userId), {
                    userId: userId,
                    name: userName,
                    password: hashedPassword,
                    createdAt: new Date()
                });

                successSignUp(userId)
                console.log('Регистрация прошла');
            }
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
    };

    const successSignUp = (value) => {
        localStorage.setItem('id', value);
        setUserName('')
        setPassword('')
        setPasswordRepeat('')
        navigate('/profile')
    }


    return (
        <div className='flex flex-col items-center'>
            <div className={`h-10 max-w-[320px] min-w-[320px] ${errorSignUp ? 'rounded-2xl flex justify-center items-center border-red-600 border-[1px]' : ''} `}>
                <span className='text-red-600 font-medium'>{errorSignUp}</span>
            </div>
            <div className='p-3'>
                <form className='flex flex-col gap-[20px] border p-6 rounded-2xl' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder='Придумайте имя )'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className='h-[50px] p-5 rounded-2xl border transition shadow-inner focus:bg-black ease-in-out duration-500 focus:text-white focus:duration-500 focus:transition'
                    />
                    <div className='flex gap-1'>
                        <input
                            type={hideShowPass ? '' : 'password'}
                            placeholder='Пароль'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='h-[50px] p-5 rounded-2xl border transition shadow-inner focus:bg-black ease-in-out duration-500 focus:text-white focus:duration-500 focus:transition'
                        />
                        <div onClick={hideShowPassword} className='p-2 w-10 rounded-2xl border flex justify-center items-center'>
                            <img src={hideShowPass ? eaysYes : eaysNo} alt='eaysYes' className='w-5' />
                        </div>
                    </div>
                    <div className='flex gap-1'>
                        <input
                            type={hideShowPassRepeat ? '' : 'password'}
                            placeholder='Повторите пароль'
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            className='h-[50px] p-5 rounded-2xl border transition shadow-inner focus:bg-black ease-in-out duration-500 focus:text-white focus:duration-500 focus:transition'
                        />
                        <div onClick={hideShowPasswordRepeat} className='p-2 w-10 rounded-2xl border flex justify-center items-center'>
                            <img src={hideShowPassRepeat ? eaysYes : eaysNo} alt='eaysNO' className='w-5' />
                        </div>
                    </div>
                    <button type='submit' className='h-[50px] rounded-2xl active:bg-black active:transition ease-in-out transition focus:duration-500 duration-500 border active:text-white'>
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
}
