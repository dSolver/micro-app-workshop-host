import React, { useEffect, useState } from 'react';
import { takeRight } from 'lodash';

import { CommunicationService, Message, MessageType } from '../services/communication.service';
import { filter } from 'rxjs';

export const useRooms = () => {
    const [service] = React.useState(CommunicationService.getInstance());

    const [rooms, setRooms] = useState<string[]>([]);

    useEffect(() => {
        setRooms(service.getAvailableRooms());
        
        const sub = service.getSubject().pipe(filter((message) => {
            return [
                MessageType.ROOMS,
                MessageType.INVITE_TO_JOIN_ROOM,
                MessageType.JOIN_ROOM,
                MessageType.LEAVE_ROOM,
                MessageType.ROOM_CREATED
            ].some((type) => type === message.type)
        })).subscribe((message: Message) => {
            setTimeout(() => {
                setRooms(service.getAvailableRooms());
            })

        })

        return () => {
            sub.unsubscribe();
        }
    }, [service])
    return rooms;
};