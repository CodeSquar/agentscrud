"use client"

import { useActionState, useEffect, useRef, useState } from "react";
import { Dialog, DialogDescription, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { deleteAgentAction } from "@/lib/actions/agents";

export default function DeleteAgentModal({ children, id }: { children: React.ReactNode, id: string }) {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(deleteAgentAction, { success: false });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state !== undefined && !isPending) {
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
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                        {state.error}
                    </div>
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
