import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { User } from '../user';
import loadable from '@loadable/component';
import { CommunicationService } from '../../services/communication.service';

import { StarterProfile } from './starterProfile';

// Register more widgets here
export const registeredWidgets: Record<string, (param: unknown) => React.ReactNode> = {
    'starter': (param: unknown) => {
        return (<StarterProfile />)
    },

}
