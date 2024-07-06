import React from 'react';
import { Link } from 'react-router-dom';

import homeImg from '../assets/image/home.svg';
import profileImg from '../assets/image/profile.svg';
import addImg from '../assets/image/addimg.svg';

export default function Footer() {
    return (
        <div className='h-[70px] w-full fixed bottom-[-10px]'>
            <div className='flex justify-center w-[100%]'>
                <div className='bg-[#000000] flex gap-[50px] items-center justify-center px-[20px] py-2 rounded-[40px]'>
                    <div className='w-9 h-9 flex justify-center items-center'>
                        <Link to='/' className='flex justify-center items-center'>
                            <img src={homeImg} alt='homeImg' />
                        </Link>
                    </div>
                    <div className='w-9 h-9 flex justify-center items-center'>
                        <Link to='/add' className='flex justify-center items-center'>
                            <img src={addImg} alt='profileImg' />
                        </Link>
                    </div>
                    <div className='w-9 h-9 flex justify-center items-center'>
                        <Link to='/list' className='flex flex-col gap-[10px] justify-center items-baseline'>
                            <span className='bg-white min-h-[2px] max-h-[2px] w-[36px]'></span>
                            <span className='bg-white min-h-[2px] max-h-[2px] w-[36px]'></span>
                            <span className='bg-white min-h-[2px] max-h-[2px] w-[36px]'></span>
                        </Link>
                    </div>
                    <div className='w-9 h-9 flex justify-center items-center'>
                        <Link to='/profile' className='flex justify-center items-center'>
                            <img src={profileImg} alt='profileImg' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
