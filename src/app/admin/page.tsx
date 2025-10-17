import AddAgentsModal from "@/components/agents/addAgentModal";
import AgentsList from "@/components/agents/agentsList";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MessageCircleIcon } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

  return (
    <div className="font-sans p-8 pb-20 gap-16 sm:p-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Agentes</h2>
        <div className="flex gap-2">
          <AddAgentsModal />
          <Link href="/admin/messages" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <MessageCircleIcon className="size-4" />
          </Link>
        </div>
      </div>
      <Suspense key={page} fallback={
        <>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full mt-2" />
          <Skeleton className="h-16 w-full mt-2" />
        </>
      }>
        <AgentsList page={page} />
      </Suspense>
    </div>
  );
}

