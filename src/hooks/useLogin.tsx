import React, { useEffect } from 'react';
import { CommunicationService, Message, MessageType } from '../services/communication.service';
import { filter } from 'rxjs';

const service = CommunicationService.getInstance();
export const useLogin = () => {
    const [username, setUsername] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    useEffect(() => {
        setUsername(service.getUserName())
        const nameChangeSub = service.getSubject().pipe(filter((message: Message) => {
            return [
                MessageType.USERNAME_SUCCESS,
                MessageType.REQUEST_USERNAME
            ].some((type) => type === message.type)
        })).subscribe(() => {
            setUsername(service.getUserName())
            setError('');
        });

        const nameErrorSub = service.getSubject().pipe(filter((message: Message) => {
            return message.type === MessageType.USERNAME_ERROR;
        })).subscribe((message: Message) => {
            setUsername('');
            setError(message.content);
        });

        return () => {
            nameChangeSub.unsubscribe();
            nameErrorSub.unsubscribe();
        }

    }, [])

    return { username, error }
}