import React from 'react';

import { ChatInput } from './ChatInput';
import { Login } from './Login';
import { ChatMessages } from './ChatMessages';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { CommunicationService } from '../services/communication.service';
import { OnlineUsers } from './OnlineUsers';
import './chat-window.scss';
import { ErrorBoundary } from 'react-error-boundary';


export interface ChatWindowProps {
    room?: string;
}

const service = CommunicationService.getInstance();
export const ChatWindow = ({ room }: ChatWindowProps) => {


    return (
        <div className="chat-window">
            <Stack direction={'row'} height="100%">
                <Stack direction='column' className="chat-section" height="100%">
                    <Paper className="chat-header" elevation={1} padding={1} component={Box} >
                        <Typography variant="h5">#{room}</Typography>
                    </Paper>

                    {
                        room ? <ChatMessages room={room} /> : null
                    }
                    {
                        service.getUserName() ? (
                            <ChatInput room={room} />
                        ) : (
                            <Login />
                        )
                    }
                </Stack>

                <ErrorBoundary fallback={<div>An error occurred with OnlineUsers component</div>}>
                    <OnlineUsers room={room} />
                </ErrorBoundary>
            </Stack>

        </div >
    )
}