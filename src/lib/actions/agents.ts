'use server';

import { createAgent, deleteAgent, updateAgent } from "@/lib/db/agents";
import { AgentInput } from "@/lib/types/agent";
import { revalidatePath } from "next/cache";

type ActionState = {
    success?: boolean;
    error?: string;
    data?: any;
};

export async function createAgentAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const name = formData.get('name') as string;
        const llm_model = formData.get('llm_model') as string;
        const system_prompt = formData.get('system_prompt') as string;
        const temperature = parseFloat(formData.get('temperature') as string);

        const agent = await createAgent({ 
            name, 
            llm_model, 
            system_prompt, 
            temperature 
        } as AgentInput);
        revalidatePath("/admin");
        return { success: true, data: agent };
    } catch (error: any) {
        return { 
            success: false, 
            error: error.message
        };
    }
}

export async function deleteAgentAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const id = formData.get('id') as string;
        
        const agent = await deleteAgent(id);
        revalidatePath("/admin");
        return { success: true, data: agent };
    } catch (error: any) {
        return { 
            success: false, 
            error: error.message
        };
    }
}

export async function updateAgentAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const llm_model = formData.get('llm_model') as string;
        const system_prompt = formData.get('system_prompt') as string;
        const temperature = parseFloat(formData.get('temperature') as string);

        const agent = await updateAgent(id, { 
            name, 
            llm_model, 
            system_prompt, 
            temperature 
        } as AgentInput);
        revalidatePath("/admin");
        return { success: true, data: agent };
    } catch (error: any) {
        return { 
            success: false, 
            error: error.message
        };
    }
}
