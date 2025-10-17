import { prisma } from "./db";
import { AgentsResponse, Agent, AgentInput, LLM_MODEL_FORMATTED } from "@/lib/types/agent";

export async function getAgents(page: number, limit: number): Promise<AgentsResponse> {
    if (limit <= 0) {
        throw new Error("Limit is invalid");
    }
    if (page <= 0) {
        throw new Error("Page is invalid");
    }
    if (limit > 50) {
        throw new Error("Max limit is 50");
    }
    const agents = await prisma.agent.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        }
    })
    const total = await prisma.agent.count()
    const totalPages = Math.ceil(total / limit)
    const currentPage = page
    const hasNextPage = currentPage < totalPages
    const hasPreviousPage = currentPage > 1
    const nextPage = hasNextPage ? currentPage + 1 : null
    const previousPage = hasPreviousPage ? currentPage - 1 : null
    return {
        agents,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
    };
}

export async function getAgentById(id: string): Promise<Agent | null> {
    const agent = await prisma.agent.findUnique({
        where: { id },
    })

    return agent || null;
}

export async function createAgent(data: AgentInput): Promise<Agent> {
    if (!data.name) {
        throw new Error("Name is required");
    }
    if (!data.llm_model) {
        throw new Error("LLM model is required");
    }
    if (!data.system_prompt) {
        throw new Error("System prompt is required");
    }
    if (data.temperature < 0 || data.temperature > 1) {
        throw new Error("Temperature must be between 0.0 and 1.0");
    }
    const agent = await prisma.agent.create({
        data: { 
            name: data.name,
            llm_model: data.llm_model,
            llm_model_formatted: LLM_MODEL_FORMATTED[data.llm_model],
            system_prompt: data.system_prompt,
            temperature: data.temperature
        },
    })
    return agent;
}

export async function deleteAgent(id: string): Promise<Agent> {
    const agent = await prisma.agent.delete({
        where: { id },
    })
    return agent;
}
export async function updateAgent(id: string, data: AgentInput): Promise<Agent> {
    if (!id) {
        throw new Error("Id is required");
    }
    if (!data.name) {
        throw new Error("Name is required");
    }
    if (!data.llm_model) {
        throw new Error("LLM model is required");
    }
    if (!data.system_prompt) {
        throw new Error("System prompt is required");
    }
    if (data.temperature < 0 || data.temperature > 1) {
        throw new Error("Temperature must be between 0.0 and 1.0");
    }
    const agent = await prisma.agent.update({
        where: { id },
        data: { 
            name: data.name,
            llm_model: data.llm_model,
            llm_model_formatted: LLM_MODEL_FORMATTED[data.llm_model],
            system_prompt: data.system_prompt,
            temperature: data.temperature
        },
    })

    return agent;
}