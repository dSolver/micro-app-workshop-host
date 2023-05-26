import React, { useEffect, useState } from 'react';

import { CommunicationService, Message } from '../services/communication.service';
import { filter } from 'rxjs';
const service = CommunicationService.getInstance();
export const useCommunicationService = (room?: string) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setMessages(service.getMessages(room));
        const sub = service.getSubject().pipe(filter((message) => {
            return message.room === room || (!room && !message.room);
        })).subscribe((message: Message) => {
            console.log('new message: ', message);
            setTimeout(() => {
                setMessages(service.getMessages(room));
            })
        })

        return () => {
            sub.unsubscribe();
        }
    }, [])

    return messages;
};