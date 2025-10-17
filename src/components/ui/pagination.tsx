"use client";
import { Button } from "./button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Pagination({ totalPages, currentPage, hasNextPage, hasPreviousPage, nextPage, previousPage }: { totalPages: number, currentPage: number, hasNextPage: boolean, hasPreviousPage: boolean, nextPage: number | null, previousPage: number | null }) {
    const router = useRouter();
    
    const handlePreviousPage = () => {
        if (previousPage) {
            router.push(`?page=${previousPage}`);
        }
    }
    
    const handleNextPage = () => {
        if (nextPage) {
            router.push(`?page=${nextPage}`);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button size="icon" onClick={handlePreviousPage} disabled={!hasPreviousPage} variant="outline">
                <ArrowLeft className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
            </span>
            <Button size="icon" onClick={handleNextPage} disabled={!hasNextPage} variant="outline">
                <ArrowRight className="size-4" />
            </Button>
        </div>
    )
}