
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { CommunicationService } from '../../services/communication.service';
import loadable from '@loadable/component';
import { Typography, Box, Stack } from '@mui/material';

const Coupled = loadable(() => import('starter/Coupled'));
const HelloWidget = loadable(() => import('starter/HelloWidget'));

const service = CommunicationService.getInstance();

export const StarterProfile = () => {
    return <ErrorBoundary fallback={<Typography color="error"> Failed to load the <em>starter</em></Typography>}>
        <Box className="User" data-package-id="host" padding={2}>
            <Stack direction='column' gap={2}>
                <HelloWidget sayHello={service.getUserName()} />
                <Coupled service={service} />
            </Stack>
        </Box>
    </ErrorBoundary>
}