import React from 'react';
import { CommunicationService } from '../services/communication.service';
import { Box, Button, Stack, TextField } from '@mui/material';

export interface ChatInputProps {
    room?: string;
}

const service = CommunicationService.getInstance();
export const ChatInput = ({ room }: ChatInputProps) => {
    const [message, setMessage] = React.useState('');

    const formRef = React.useRef<HTMLFormElement>(null);
    return (
        <Box className="chat-input" padding={1} marginBottom={1}>
            <form autoComplete='off' ref={formRef} onSubmitCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (message.trim().length > 0) {
                    service.sendMessage(message.trim(), room);
                }
                
                setMessage('');
            }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField multiline={true} fullWidth={true} type="text" value={message} onChange={(e) => {
                        setMessage(e.target.value);
                    }} onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            formRef.current?.requestSubmit();
                        }
                    }} />
                    <Button type="submit">Send</Button>
                </Stack>
            </form>
        </Box>
    )
}