import { NextRequest, NextResponse } from "next/server";
import { getAgents, createAgent, deleteAgent, updateAgent } from "@/lib/db/agents";


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 2;
        const agents = await getAgents(Number(page), Number(limit));
        return NextResponse.json({ success: true, data: agents });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.status || 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, llm_model, system_prompt, temperature } = await request.json();
        const agent = await createAgent({ name, llm_model, system_prompt, temperature });
        return NextResponse.json({ success: true, data: agent });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.status || 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const agent = await deleteAgent(id);
        return NextResponse.json({ success: true, data: agent });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.status || 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, name, llm_model, system_prompt, temperature } = await request.json();
        const agent = await updateAgent(id, { name, llm_model, system_prompt, temperature });
        return NextResponse.json({ success: true, data: agent });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.status || 500 }
        );
    }
}