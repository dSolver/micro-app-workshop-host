import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import Typography from '@mui/material/Typography';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import { CommunicationService } from '../services/communication.service';
import LogoutIcon from '@mui/icons-material/Logout';
const service = CommunicationService.getInstance();
export const CurrentUser = () => {
    const { username, error } = useLogin();

    return (
        <Stack direction={'row'} alignItems={'center'} width="100%" className="current-user" marginBottom={2} >
            <Stack direction='row' width="100%" alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant="h5" flex="1 1">@{username}</Typography>
                <IconButton onClick={() => { service.setUserName('') }} ><LogoutIcon titleAccess='Logout' /></IconButton>
            </Stack>
        </Stack >
    )
}