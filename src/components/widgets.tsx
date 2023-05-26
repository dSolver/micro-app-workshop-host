import { Typography } from '@mui/material';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import loadable from '@loadable/component';
import { CommunicationService } from '../services/communication.service';
import { UserPage } from './user';

export const registeredWidgets: Record<string, (param: string) => React.ReactNode> = {
    'starter': (param: string) => {
        return (
            <ErrorBoundary fallback={<Typography color="error"> Failed to load the <em>starter</em></Typography>}>
                <UserPage username="starter" />
            </ErrorBoundary>
        )
    }
}
