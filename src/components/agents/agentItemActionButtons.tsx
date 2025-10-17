"use client";

import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import EditAgentModal from "./editAgentModal";
import { PencilIcon, TrashIcon } from "lucide-react";
import DeleteAgentModal from "./deleteAgentModal";
import { Agent } from "@/lib/types/agent";

export default function AgentItemActionButtons({ agent }: { agent: Agent }) {
  
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">...</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <EditAgentModal agent={agent}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <PencilIcon className="size-4" />
                    Editar
                </DropdownMenuItem>
            </EditAgentModal>
            <DeleteAgentModal id={agent.id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <TrashIcon className="size-4" />
                    Eliminar
                </DropdownMenuItem>
            </DeleteAgentModal>
        </DropdownMenuContent>
       </DropdownMenu>
    )
}
