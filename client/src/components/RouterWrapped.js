import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthPage } from './authPage/AuthPage';
import { DialogsPage } from './DialogsPage';


export const RouterWrapped = () => {
    return(
        <div>
            <Routes>
                <Route path = "/" exact element = {<AuthPage/>} />
                <Route path = "/dialogs" exact element = {<DialogsPage/>} />
                {/* <Route path = "/dialogs/current" element = {<CurrentDialog/>} /> */}
            </Routes>
        </div>
    )
}