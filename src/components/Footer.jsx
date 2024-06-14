import React from 'react'
import { Link } from 'react-router-dom'

import homeImg from '../assets/image/home.svg'
import profileImg from '../assets/image/profile.svg'

export default function Footer() {
    return (
        <div className='h-[50px] w-[100%] border-t border-black fixed bottom-0'>
            <div className='flex h-full items-center justify-center gap-[50px]'>
                <div className='w-[40px] h-[40px]'>
                    <Link to='/'>
                        <img className='w-[40px] h-[40px]' src={homeImg} alt='homeImg' />
                    </Link>
                </div>
                <div className='w-[40px] bg-black rounded-3xl flex justify-center items-center'>
                    <button className=''>
                        <span className='text-[40px] leading-[35px] text-white text-center'>+</span>
                    </button>
                </div>
                <div className='w-[40px] h-[40px]'>
                    <Link to='/profile'>
                        <img className='w-[40px] h-[40px]' src={profileImg} alt='profileImg' />
                    </Link>
                </div>
            </div>
        </div>
    )
}
