import AgentItem from "./agentItem";
import { Empty, EmptyDescription, EmptyTitle, EmptyContent, EmptyHeader, EmptyMedia } from "../ui/empty";
import { Frown } from "lucide-react";
import AddAgentsModal from "./addAgentModal";
import Pagination from "../ui/pagination";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Agent } from "@/lib/types/agent";
import { redirect } from "next/navigation";

export default async function AgentsList({ page = 1, className }: { page?: number, className?: string }) {
    const limit = 4;
    const agents = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents?page=${page}&limit=${limit}`, {
        cache: 'force-cache'
    });
    const agentsData = await agents.json();
    console.log(agentsData);
    if(agentsData?.data?.agents?.length === 0 && page > agentsData.data.totalPages && agentsData.data.totalPages > 0) {
        redirect(`/admin?page=${agentsData.data.totalPages}`);
    }
    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            <div className="flex flex-col gap-2">
                {agentsData?.data?.agents?.map((agent: Agent) => (
                    <AgentItem agent={agent} key={agent.id} />
                ))}
            </div>
            {agentsData?.error && (
                <Alert variant="destructive">
                    <Frown className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Hubo un error al cargar los agentes
                    </AlertDescription>
                </Alert>
            )}
            {agentsData?.data?.agents?.length === 0 && (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                            <Frown className="size-4" />
                        </EmptyMedia>
                        <EmptyTitle>No se encontraron agentes</EmptyTitle>
                        <EmptyDescription>Crea un agente para comenzar</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <AddAgentsModal />
                    </EmptyContent>
                </Empty>
            )}
            
            {agentsData?.data?.totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination 
                        totalPages={agentsData.data.totalPages} 
                        currentPage={agentsData.data.currentPage} 
                        hasNextPage={agentsData.data.hasNextPage} 
                        hasPreviousPage={agentsData.data.hasPreviousPage} 
                        nextPage={agentsData.data.nextPage} 
                        previousPage={agentsData.data.previousPage} 
                    />
                </div>
            )}
        </div>
    )
}