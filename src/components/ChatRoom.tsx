import React, { useEffect, useState } from 'react';

import { CommunicationService } from '../services/communication.service';
import { ChatWindow } from './ChatWindow';
import { Box, Stack } from '@mui/material';
import { RoomNav } from './RoomNav';
import { useLogin } from '../hooks/useLogin';
import { Login } from './Login';
import { CurrentUser } from './CurrentUser';
import "./chat-room.scss";
import { useRooms } from '../hooks/useRooms';
import { set } from 'lodash';

const service = CommunicationService.getInstance();


export const ChatRoom = () => {
    const [currentRoom, setCurrentRoom] = useState<string>();

    const { username } = useLogin();

    const rooms = useRooms();

    useEffect(() => {
        if (!currentRoom && rooms.length > 0) {
            service.joinRoom(rooms[0]);
            setCurrentRoom(rooms[0]);
        }
    }, [currentRoom, rooms])

    return (
        <Box className="App">
            <Stack direction={'row'} height={"100%"}>
                {
                    !username ? <Login /> : null
                }
                {
                    username && (
                        <>
                            <Stack className="left-bar" direction="column" alignItems={"flex-start"} justifyContent={"space-between"}>
                                <RoomNav currentRoom={currentRoom} onRoomSelected={(room) => {
                                    setCurrentRoom(room);
                                    service.joinRoom(room);
                                }} />
                                <CurrentUser />
                            </Stack>

                            {
                                currentRoom ? <ChatWindow key={currentRoom} room={currentRoom} /> : null
                            }
                        </>
                    )
                }

            </Stack>

        </Box>
    );
}