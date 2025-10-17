"use client"

import { useState } from "react";
import AgentItemActionButtons from "./agentItemActionButtons";
import { Agent } from "@/lib/types/agent";
import { Badge } from "../ui/badge";
import { Brain, ThermometerIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
export default function AgentItem({ agent }: { agent: Agent }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div key={agent.id} className="bg-card p-4 rounded-md w-full flex justify-between items-start animate-blurred-fade-in animate-duration-300 border">
            <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2 max-md:flex-col max-md:items-start">
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            <Brain className="w-4 h-4" />
                            {agent.llm_model_formatted}
                        </Badge>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="secondary" className="text-xs">
                                    <ThermometerIcon className="w-4 h-4" />
                                    {agent.temperature.toFixed(1)}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Temperatura del modelo</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                <p
                    onClick={() => setExpanded(!expanded)}
                    className={`text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors ${expanded ? "" : "line-clamp-2"}`}
                >
                    {agent.system_prompt}
                </p>
            </div>
            <AgentItemActionButtons agent={agent} />
        </div>
    )
}
