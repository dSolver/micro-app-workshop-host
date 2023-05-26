import React, { useCallback, useState } from 'react'
import { useOnlineUsers } from '../hooks/useOnlineUsers';
import { Box, Button, Icon, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import loadable from '@loadable/component'
import './online-users.scss';
import { CommunicationService } from '../services/communication.service';
import { registeredWidgets } from './widgets';

const HelloWidget = loadable(() => import('starter/HelloWidget'), {
    fallback: <Typography>Loading HelloWidget...</Typography>,

});
const Coupled = loadable(() => import('starter/Coupled'), {
    fallback: <Typography>Loading Coupled...</Typography>,
});

export interface OnlineUsersProps {
    room?: string
}

export const OnlineUsers = ({ room }: OnlineUsersProps) => {

    const users = useOnlineUsers(room);

    const [focused, setFocused] = useState('');

    return (
        <Box className="online-users">
            {!focused && (
                <>
                    <Typography variant="h5">Online Users</Typography>
                    <List>
                        {
                            users.map((user, index) => (
                                <ListItem key={index} component="div">
                                    <ListItemButton onClick={() => setFocused(user)}>
                                        <ListItemText primary={user} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                </>
            )}
            {
                focused && (
                    <Box>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => setFocused('')}>Back</Button>
                        {
                            registeredWidgets[focused] && registeredWidgets[focused](focused)
                        }
                        {
                            !registeredWidgets[focused] && (<Typography variant="body1">No widget registered for {focused}.</Typography>)
                        }
                    </Box>

                )
            }



        </Box>
    )

}
