import React from 'react';
import { useRooms } from '../hooks/useRooms';
import { List, ListItem, ListItemButton, Typography } from '@mui/material';
import "./room-nav.scss";

export interface RoomNavProps {
    currentRoom?: string;
    onRoomSelected: (room: string) => void;
}

export const RoomNav = ({ currentRoom, onRoomSelected }: RoomNavProps) => {
    const rooms = useRooms();
    return (
        <div className="room-nav">
            <Typography variant="h5">Rooms</Typography>
            <List>
                {
                    rooms.map((room, index) => (
                        <ListItem key={index}>
                            <ListItemButton
                                onClick={() => onRoomSelected(room)}>
                                <Typography variant="body1"
                                    fontWeight={currentRoom === room ? 600 : 400}>
                                    {room}
                                </Typography>
                            </ListItemButton></ListItem>
                    ))
                }
            </List>
        </div>
    )
}