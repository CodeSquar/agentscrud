export interface SocketError {
  message: string;
  code?: string;
}

export interface SendMessagePayload {
  message: string;
  roomId: string;
  userId: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

