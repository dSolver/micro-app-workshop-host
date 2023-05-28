/**
 * An example of a component that is remotely loading components for a page
 */

import React from 'react'
import { Box, Stack, Typography } from '@mui/material';
import { withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import loadable from '@loadable/component';
import { CommunicationService } from '../services/communication.service';


// This one is tied to the route
export const UserPage = () => {
    const params = useParams();
    const username = params.username;
    return (
        <>
            {username && <User username={username} />}
        </>
    )
}


// This is the actual component, it is currently tied to the starter package
const service = CommunicationService.getInstance();

const Coupled = loadable(() => import('starter/Coupled'));
const HelloWidget = loadable(() => import('starter/HelloWidget'));

export const User = withErrorBoundary(({ username }: { username: string }) => {
    return (
        <Box className="User" data-package-id="host" padding={2}>
            <Stack direction='column' gap={2}>
                
                <HelloWidget sayHello={username} />

                <Coupled service={service} fallback={<Typography>Loading Coupled...</Typography>} />
            </Stack>
        </Box>
    )


}, {
    fallback: <Typography color="error">UserPage failed to load</Typography>,
})