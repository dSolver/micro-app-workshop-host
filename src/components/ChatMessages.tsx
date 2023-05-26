import React, { useState } from 'react';
import { useCommunicationService } from '../hooks/useCommunicationService';
import { Box, Stack, Typography } from '@mui/material';

import './chat-messages.scss';

import { TimeUtility } from '../services/time.utility';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

export interface ChatMessagesProps {
    room?: string;
}
export const ChatMessages = ({ room }: ChatMessagesProps) => {
    const messages = useCommunicationService(room);

    const [ref, { entry, rootRef }] = useIntersectionObserver();
    const [shouldScroll, setShouldScroll] = useState(true);

    React.useEffect(() => {
        const t = setTimeout(() => {
            if (shouldScroll) {
                entry?.target.scrollIntoView({ behavior: 'auto' });
            }
        }, 50)

        return () => {
            clearTimeout(t);
        }
    }, [messages, entry?.isIntersecting, shouldScroll]);

    return (
        <div className="chat-messages" style={{ flex: '1 1', overflow: 'auto' }} ref={rootRef} onScroll={(e) => {
            const element = e.target as HTMLDivElement;
            const diff = element.scrollHeight - (element.scrollTop + element.clientHeight)
            setShouldScroll(diff < 40)
        }}>

            <Stack direction="column" gap={3} className="messages" >
                {messages.filter(message => message.content.length > 0).map((message, index) => (
                    <Box key={index}>
                        <Stack direction="column" gap={1}>
                            <Stack direction="row" gap={1} alignItems="center">
                                <Typography variant="body1" width={100}>
                                    <b>{message.sender}</b>
                                </Typography>
                                <Typography variant="body1" fontSize={"1rem"} color="#777">{TimeUtility.getFormattedTime(message.timestamp)}</Typography>
                            </Stack>

                            <div className="message-content" dangerouslySetInnerHTML={{ __html: message.content }}></div>

                        </Stack>

                    </Box>
                ))}
            </Stack>
            <div id="bottom" ref={ref}></div>
        </div>
    )
}