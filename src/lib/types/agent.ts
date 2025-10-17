export type LLMModel = 'GPT_5_NANO' | 'CLAUDE_4_OPUS' | 'GEMINI_2_5_PRO';

export const LLM_MODELS: readonly LLMModel[] = ['GPT_5_NANO', 'CLAUDE_4_OPUS', 'GEMINI_2_5_PRO'] as const;

export const LLM_MODEL_FORMATTED: Record<LLMModel, string> = {
    GPT_5_NANO: 'GPT 5 Nano',
    CLAUDE_4_OPUS: 'Claude 4 Opus',
    GEMINI_2_5_PRO: 'Gemini 2.5 Pro'
};

export interface Agent {
    id: string;
    name: string;
    system_prompt: string;
    llm_model: LLMModel;
    llm_model_formatted: string;
    temperature: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface AgentInput {
    name: string;
    system_prompt: string;
    llm_model: LLMModel;
    temperature: number;
}
export interface AgentsResponse {
    agents: Agent[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
}