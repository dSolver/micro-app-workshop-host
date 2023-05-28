import { io, Socket } from 'socket.io-client';
import { filter, Subject } from 'rxjs';
import * as DOMPurify from 'dompurify';
import { marked } from 'marked';

export enum MessageType {
    CHAT_MESSAGE = 'chat message',
    CHAT_CATCHUP = 'chat catchup',
    REQUEST_USERNAME = 'request username',
    SET_USERNAME = 'set username',
    USERNAME_ERROR = 'username error',
    USERNAME_SUCCESS = 'username success',
    ONLINE_USERS = 'online users',
    LIST_ROOMS = 'list rooms',
    CREATE_ROOM = 'create room',
    CREATE_PRIVATE_ROOM = 'create private room',
    CREATE_ROOM_ERROR = 'create room error',
    CREATE_ROOM_SUCCESS = 'create room success',
    JOIN_ROOM = 'join room',
    LEAVE_ROOM = 'leave room',
    INVITE_TO_JOIN_ROOM = 'invite to join room',
    REQUEST_TO_JOIN_ROOM = 'request to join room',
    ROOM_MESSAGE = 'room message',
    ROOM_USERS = 'room users',
    ROOM_USER_COUNT = 'room user count',
    ROOMS = 'rooms',
    ROOM_CREATED = 'room created',
    ROOM_JOINED = 'room joined',
    ROOM_LEFT = 'room left',
    ROOM_DELETED = 'room deleted',
}

export interface Message {
    room?: string;
    sender: string;
    type: MessageType;
    content: string;
    timestamp: Date;
}

export interface RoomInfo {
    name: string;
    owner: string;
    isPrivate: boolean;
}

export interface RoomContext {
    room: string;
    users: string[];
    messages: Message[];
    socket: Socket;
}

/**
 * CommunicationService is a singleton service that handles connection to the socket.io service.
 */
export class CommunicationService {
    private mainSocket: Socket;
    private messageSubject: Subject<Message> = new Subject<Message>();

    private rooms = new Map<string, RoomContext>();

    private availableRooms: { [key: string]: RoomInfo } = {}

    private roomUsers = new Map<string, string[]>();

    private location: string;

    private username: string = "";

    constructor(_location: string = 'http://localhost:80') {
        this.location = _location;
        this.mainSocket = io(this.location);
        this.setupSocketListeners(this.mainSocket);

        this.username = localStorage.getItem('username') ?? '';

    }

    static instance: CommunicationService;

    static getInstance(): CommunicationService {
        return this.instance || (this.instance = new CommunicationService());
    }

    cleanMessage(msg: string): string {
        return DOMPurify.sanitize(marked(msg));
    }

    getSubject() {
        return this.messageSubject.asObservable();
    }

    getUserName() {
        return this.username;
    }

    getOnlineUsers(room?: string): string[] {
        return this.roomUsers.get(room ?? '') ?? [];
    }

    setUserName(username: string) {
        localStorage.setItem('username', username);
        this.username = username;
        this.mainSocket.emit(MessageType.SET_USERNAME, username);
        this.rooms.forEach((room) => {
            room.socket.emit(MessageType.SET_USERNAME, username);
        });
    }

    removeUserName() {
        this.username = "";
    }

    getAvailableRooms(): string[] {
        return Object.keys(this.availableRooms);
    }

    joinRoom(room: string) {
        if (!this.rooms.has(room)) {
            const roomSocket = io(`${this.location}/${room}`);
            this.setupSocketListeners(roomSocket, room);
            const context: RoomContext = {
                room,
                users: [],
                messages: [],
                socket: roomSocket,
            }
            this.rooms.set(room, context);
            roomSocket.emit(MessageType.JOIN_ROOM)
            roomSocket.emit(MessageType.SET_USERNAME, this.username)

            console.log(`joined room ${room}, listening for messages`)
            this.messageSubject.pipe(filter((msg) => msg.room === room)).subscribe((msg) => {
                console.log('received message');
                context.messages.push(msg);
                if (context.messages.length > 200) {
                    context.messages.shift();
                }
            })
        }
    }

    /**
     * creates a room, not yet ready for use
     * @param room 
     * @param isPrivate 
     */
    createRoom(room: string, isPrivate: boolean) {
        this.mainSocket.emit(MessageType.CREATE_ROOM, room, isPrivate);
    }

    /**
     * Adds a room to the list of available rooms, client-side only
     * @param room 
     */
    addAvailableRoom(room: RoomInfo) {
        this.availableRooms[room.name] = room;
    }

    /**
     * Sends a chat message to the server, optionally to a specific room
     * @param msg 
     * @param room 
     */
    sendMessage(msg: string, room?: string) {
        if (room) {
            this.rooms.get(room)?.socket.emit(MessageType.CHAT_MESSAGE, msg);
        } else {
            this.mainSocket.emit(MessageType.CHAT_MESSAGE, msg);
        }
    }

    /**
     * returns a list of messages for a given room, or the main room if none is specified
     * @param room 
     * @returns 
     */
    getMessages(room?: string) {
        const context = this.rooms.get(room ?? '')
        if (context) {
            return [...context.messages];
        }
        // main room messages are empty
        return [];
    }

    requestAvailableRooms() {
        this.mainSocket.emit(MessageType.LIST_ROOMS);
    }

    /**
     * Adds the event listeners to a socket
     * @param socket 
     * @param room 
     */
    setupSocketListeners(socket: Socket, room?: string) {
        socket.on('connect', () => {
            this.messageSubject.next({
                room,
                sender: 'System',
                type: MessageType.CHAT_MESSAGE,
                content: `Connected to #${room || 'main'}`,
                timestamp: new Date(),
            });
        });

        socket.on('disconnect', () => {
            this.messageSubject.next({
                room,
                sender: 'System',
                type: MessageType.CHAT_MESSAGE,
                content: `Disconnected from #${room || 'main'}`,
                timestamp: new Date(),
            });
        });

        socket.on(MessageType.CHAT_MESSAGE, (msg: Message) => {
            this.messageSubject.next({
                ...msg,
                room,
                content: this.cleanMessage(msg.content),
                timestamp: new Date(msg.timestamp)
            });
        });

        socket.on(MessageType.CHAT_CATCHUP, (msgs: Message[]) => {
            const context = this.rooms.get(room ?? '');
            if (context) {
                context.messages = [...context.messages, ...msgs.map(m => ({
                    ...m,
                    content: this.cleanMessage(m.content),
                    timestamp: new Date(m.timestamp)
                }))].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

                this.messageSubject.next({
                    room,
                    sender: 'System',
                    type: MessageType.CHAT_MESSAGE,
                    content: '',
                    timestamp: new Date(),
                })
            }
        });

        socket.on(MessageType.REQUEST_USERNAME, () => {
            console.log("request username")
            this.messageSubject.next({
                room,
                sender: 'System',
                type: MessageType.REQUEST_USERNAME,
                content: 'Please set a username',
                timestamp: new Date(),
            });

            if (this.username) {
                console.log("Already have a username, sending it to server");
                this.setUserName(this.username);
            }
        })

        socket.on(MessageType.USERNAME_ERROR, (errorMessage: string) => {
            // locally stored username is invalid, so erase it
            this.removeUserName();

            this.messageSubject.next({
                room,
                sender: 'System',
                type: MessageType.USERNAME_ERROR,
                content: errorMessage,
                timestamp: new Date(),
            });
        })

        socket.on(MessageType.USERNAME_SUCCESS, (message: string) => {
            this.messageSubject.next({
                room,
                sender: 'System',
                type: MessageType.USERNAME_SUCCESS,
                content: message,
                timestamp: new Date(),
            })

            // request rooms
            console.log('Requesting rooms on main socket')
            this.requestAvailableRooms();
        });

        socket.on(MessageType.ONLINE_USERS, (users: string[]) => {
            console.log("online users of room " + room);
            console.log(users);
            this.roomUsers.set(room ?? '', users);
            this.messageSubject.next({
                room,
                sender: 'System',
                type: MessageType.ONLINE_USERS,
                content: '',
                timestamp: new Date(),
            });
        });

        socket.on(MessageType.ROOMS, (rooms: Array<RoomInfo>) => {
            console.log("rooms: ", rooms)
            rooms.forEach((roomInfo) => {
                this.addAvailableRoom(roomInfo);
            })
            this.messageSubject.next({
                room,
                sender: 'System',
                type: MessageType.ROOMS,
                content: '',
                timestamp: new Date()
            })
        });

        socket.on(MessageType.ROOM_CREATED, (roomInfo: RoomInfo) => {
            this.addAvailableRoom(roomInfo);
        });

        socket.on(MessageType.ROOM_JOINED, (roomInfo: RoomInfo) => {
            this.addAvailableRoom(roomInfo);
        });

    }

}
