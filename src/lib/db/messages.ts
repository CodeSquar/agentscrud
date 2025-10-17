import { prisma } from "./db";
import { Message, MessageInput, MessagesResponse } from "@/lib/types/message";

export async function getAllMessages(page: number, limit: number): Promise<MessagesResponse> {
    if (limit <= 0) {
        throw new Error("Limit is invalid");
    }
    if (page <= 0) {
        throw new Error("Page is invalid");
    }
    if (limit > 50) {
        throw new Error("Max limit is 50");
    }
    const messages = await prisma.message.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        }
    })
    const reversedMessages = messages.reverse();
    
    const total = await prisma.message.count()
    const totalPages = Math.ceil(total / limit)
    const currentPage = page
    const hasNextPage = currentPage < totalPages
    const hasPreviousPage = currentPage > 1
    const nextPage = hasNextPage ? currentPage + 1 : null
    const previousPage = hasPreviousPage ? currentPage - 1 : null
    return {
        messages: reversedMessages,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
    };
}

export async function createMessage(message: MessageInput): Promise<Message> {
    if (!message.content) {
        throw new Error("Content is required");
    }
    if (!message.sender_id) {
        throw new Error("Sender id is required");
    }
    const newMessage = await prisma.message.create({
        data: message,
    });
    return newMessage;
}
