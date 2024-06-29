import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import MainLayouts from '../layout/MainLayouts'
import HomePage from '../pages/home/HomePage'
import NotFound from '../pages/notfound/NotFound'
import ProfilePage from '../pages/profile/ProfilePage'
import LoginPage from '../pages/login/LoginPage'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayouts />}>
                    <Route index element={<HomePage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
