import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import MainLayouts from '../layout/MainLayouts'
import HomePage from '../pages/home/HomePage'
import NotFound from '../pages/notfound/NotFound'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayouts />}>
                    <Route index element={<HomePage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
