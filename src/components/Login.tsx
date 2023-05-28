import React from 'react';
import { CommunicationService } from '../services/communication.service';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import './login.scss';
import { useLogin } from '../hooks/useLogin';
const service = CommunicationService.getInstance();
export const Login = () => {

    const [username, setUsername] = React.useState('');
    const { error } = useLogin();
    return (
        <Box className="login" padding={1}>
            <Stack direction='column' gap={2} alignItems="center">
                <Typography variant="h1">Sup?</Typography>

                <form onSubmitCapture={(e) => {
                    e.preventDefault();
                    service.setUserName(username);
                }}>
                    <Stack direction='row' gap={2} alignItems="center">
                        <TextField InputLabelProps={{ shrink: true }} id="outlined-basic" label="Enter Alias" value={username} onChange={(e) => {
                            setUsername(e.target.value);
                        }} error={!!error} />

                        <Button type="submit">Wazzup</Button>
                    </Stack>

                    {error && <Typography variant="body1" color="error">{error}</Typography>}
                </form>
            </Stack>
        </Box>)
}