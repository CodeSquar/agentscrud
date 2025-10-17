'use server';

import { createMessage } from "@/lib/db/messages";

type ActionState = {
    success?: boolean;
    error?: string;
    data?: any;
};

export async function createMessageAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const content = formData.get('content') as string;
        const sender_id = formData.get('sender_id') as string;
        const receiver_id = formData.get('receiver_id') as string;

        const message = await createMessage({ content, sender_id, receiver_id });
        return { success: true, data: message };
    } catch (error: any) {
        return { 
            success: false, 
            error: error.message
        };
    }
}

