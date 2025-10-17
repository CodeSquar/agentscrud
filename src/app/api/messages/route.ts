import { NextRequest, NextResponse } from "next/server";
import { getAllMessages } from "@/lib/db/messages";
import { createMessage } from "@/lib/db/messages";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 30;
        const messages = await getAllMessages(Number(page), Number(limit));
        return NextResponse.json({ success: true, data: messages });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.status || 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { content, sender_id, receiver_id } = await request.json();
        const message = await createMessage({ content, sender_id, receiver_id });
        return NextResponse.json({ success: true, data: message });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.status || 500 }
        );
    }
}   