/**
 * locally defining routes for the starter app
 */


import React from 'react';
import loadable from "@loadable/component";
import { Stack, Typography } from "@mui/material"
import { Outlet, RouteObject } from "react-router-dom"
import { ErrorBoundary } from 'react-error-boundary';


const HelloWidget = loadable(() => import('starter/HelloWidget'), {
    fallback: <Typography>Loading HelloWidget from Starter...</Typography>,
});


export default [
    {
        path: "/starter",
        element: (
            <ErrorBoundary fallback={<Typography color="error"> Failed to load the <em>starter/HelloWidget</em></Typography>}>
                <Stack direction={'column'} padding={2} gap={2} height={"100%"}>
                    <HelloWidget sayHello='stranger' />
                    <Outlet />
                </Stack>
            </ErrorBoundary>),
        children: [
            {
                path: "test",
                element: (<Stack direction={'row'} gap={2} height={"100%"}><Typography>Test</Typography></Stack>)
            },
        ]
    },
] as RouteObject[]