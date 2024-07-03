import React, { useState } from 'react';
import eaysYes from '../../assets/image/eaysyes.svg'
import eaysNo from '../../assets/image/eaysno.svg'

import { db } from '../../firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
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
      // Поиск пользователя по имени
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", "==", userName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("User not found");
      }

      // Получение данных пользователя
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Проверка пароля
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (!passwordMatch) {
        throw new Error("Incorrect password");
      }

      successSignUp(userData.userId);
    } catch (error) {
      console.error('Error logging in user:', error.message);
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
    <>
      <div className={`h-10 max-w-[320px] min-w-[320px] ${errorSignUp ? 'rounded-2xl flex justify-center items-center border-red-600 border-[1px]' : ''} `}>
        <span className='text-red-600 font-medium'>{errorSignUp}</span>
      </div>
      <div className='p-3'>
        <form className='flex flex-col gap-[20px] border p-6 rounded-2xl' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Имя )'
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
            Войти
          </button>
        </form>
      </div>
    </>
  );
}
