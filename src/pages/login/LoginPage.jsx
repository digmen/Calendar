import React, { useState } from 'react'
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function LoginPage() {

    const [loginState, setLoginState] = useState(false);

    return (
        <div className='flex flex-col justify-center items-center mt-[20px] mx-auto max-w-[320px]'>
            {loginState ? <SignIn /> : <SignUp />}
            <button className='bg-white  w-full active:transition transition rounded-2xl ease-in-out duration-500 active:rounded-2xl p-3 border active:text-white active:bg-black' onClick={() => setLoginState(prev => !prev)}> {loginState ? 'Зарегестрироваться' : 'Войти'}</button>
        </div>
    )
}
