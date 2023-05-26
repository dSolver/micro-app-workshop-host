import './App.scss';

import React, { useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ChatRoom } from './components/ChatRoom';
import { User } from './components/user';
import { Typography } from '@mui/material';

const router = createBrowserRouter([
    {
        path: "/",
        element: <ChatRoom />
    }, {
        path: "user/:username",
        element: <User />
    },
    {
        path: "*",
        element: <Typography>404, page does not exist</Typography>
    }
])
function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App;
