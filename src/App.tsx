import React, { useEffect } from 'react';
import {
    RouterProvider,
    RouteObject,
    createBrowserRouter
} from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.scss';

import { getRoutesWithRemote, getRoutesOnlyLocal } from './routes';

function App() {
    const [routes, setRoutes] = React.useState<RouteObject[]>([]);
    useEffect(() => {
        console.log("Loading routes");
        getRoutesWithRemote().then((routes) => {
            setRoutes(routes);
        }).catch((e) => {
            console.error(e);
        });
    }, [])

    if (routes.length === 0) {
        return null;
    }

    return (
        <RouterProvider router={createBrowserRouter(routes)} />
    )
}

export default App;
