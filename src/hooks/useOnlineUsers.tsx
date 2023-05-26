import React from 'react';
import { CommunicationService } from '../services/communication.service';
import { filter } from 'rxjs';

const service = CommunicationService.getInstance();
export const useOnlineUsers = (room?: string) => {

    const [users, setUsers] = React.useState<string[]>([]);

    React.useEffect(() => {
        setUsers(service.getOnlineUsers(room));
        
        const sub = service.getSubject()
            .pipe(filter((message) => (!room && !message.room) || message.room === room))
            .subscribe(() => {
                setTimeout(() => {
                    setUsers(service.getOnlineUsers(room));
                })
            });

        return () => {
            sub.unsubscribe();
        }
    }, [])

    return users;
}