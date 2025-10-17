"use client"

import { useActionState, useEffect, useRef, useState } from "react";
import { Dialog, DialogDescription, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { deleteAgentAction } from "@/lib/actions/agents";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Frown } from "lucide-react";

export default function DeleteAgentModal({ children, id }: { children: React.ReactNode, id: string }) {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(deleteAgentAction, { success: false });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state !== undefined && !isPending && state.success === true) {
            setOpen(false);
            formRef.current?.reset();
        }
    }, [state, isPending]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button>Eliminar</Button>}
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={() => setOpen(false)} className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Eliminar Agente</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que quieres eliminar este agente? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                {state.error && (
                    <Alert variant="destructive">
                        <Frown className="size-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Hubo un error al eliminar el agente
                        </AlertDescription>
                    </Alert>
                  
                )}
                <form ref={formRef} action={formAction}>
                    <input type="hidden" name="id" value={id} />
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive" 
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Eliminando..." : "Sí, Eliminar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
