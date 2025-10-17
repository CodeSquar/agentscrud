export interface Message {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    sender_id: string;
    receiver_id: string | null;
    content: string;
}
export interface MessageInput {
    sender_id: string;
    receiver_id: string | null;
    content: string;
}
export interface MessagesResponse {
    messages: Message[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
}