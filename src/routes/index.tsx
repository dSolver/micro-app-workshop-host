import React, { useState } from "react";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import { ChatRoom } from "../components/ChatRoom";
import { User } from "../components/user";
import { Typography } from "@mui/material";
import loadable from "@loadable/component";
import starterRoutes from "./starter";

const defaultRoutes: RouteObject[] = [
    {
        path: "/",
        element: <ChatRoom />
    }, {
        path: "/users/:username",
        element: <User />
    },
    {
        path: "*",
        element: <Typography>404, page does not exist</Typography>
    }
]

export const getRoutesWithRemote = (): Promise<RouteObject[]> => {

    // define routes that are loaded remotely
    // note that we have to use the string as is here, instead of runtime variables
    // this is because webpack module federation needs to know at build time where
    // remote modules are used.
    // the @loadable/component library can bypass this limitation, but it is limited
    // only react components
    // NOTE: remote imports are not available during unit testing.

    const imports = [
        import('starter/externalRoutes'),
    ]

    return new Promise((resolve) => {
        const allRoutes: RouteObject[] = [...defaultRoutes]

        let processed = 0;

        imports.map((importPromise) => {
            importPromise.then((routes) => {
                console.log("Loaded routes from starter", routes);
                allRoutes.push(...routes.default)
            }).catch((e) => {
                console.error(e)
            }).finally(() => {
                processed++;
                if (processed === imports.length) {
                    resolve(allRoutes);
                }
            });
        });
    })
}

export const getRoutesOnlyLocal = (): Promise<RouteObject[]> => {
    return Promise.resolve([...defaultRoutes, ...starterRoutes]);
}