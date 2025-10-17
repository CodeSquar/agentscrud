"use client"

import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog"
import { FieldGroup, Field, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useActionState, useEffect, useRef, useState } from "react"
import { updateAgentAction } from "@/lib/actions/agents"
import { Agent, LLM_MODELS, LLM_MODEL_FORMATTED } from "@/lib/types/agent"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Frown } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export default function EditAgentModal({ children, agent }: { children: React.ReactNode, agent: Agent }) {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(updateAgentAction, { success: false });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state !== undefined && !isPending && state.success === true) {
            setOpen(false);
            formRef.current?.reset();
        }
    }, [state, isPending]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="w-full">
                {children || <Button>Editar</Button>}
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={() => setOpen(false)} className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Agente</DialogTitle>
                    <DialogDescription>Editar la configuración del agente</DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction}>
                    <FieldGroup>
                        {state.error && (
                            <Alert variant="destructive">
                                <Frown className="size-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    Hubo un error al editar el agente
                                </AlertDescription>
                            </Alert>
                        )}
                        <input type="hidden" name="id" value={agent.id} />
                        <Field>
                            <FieldLabel htmlFor="edit-agent-name">Nombre</FieldLabel>
                            <Input
                                id="edit-agent-name"
                                name="name"
                                placeholder="Mi Agente Personalizado"
                                defaultValue={agent.name}
                                disabled={isPending}
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="edit-agent-llm-model">Modelo LLM</FieldLabel>
                            <Select
                                name="llm_model"
                                defaultValue={agent.llm_model}
                                disabled={isPending}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un modelo LLM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {LLM_MODELS.map((model) => (
                                            <SelectItem key={model} value={model}>
                                                {LLM_MODEL_FORMATTED[model]}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="edit-agent-temperature">Temperatura (0.0 - 1.0)</FieldLabel>
                            <Input
                                id="edit-agent-temperature"
                                name="temperature"
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                defaultValue={agent.temperature}
                                disabled={isPending}
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="edit-agent-system-prompt">Prompt del Sistema</FieldLabel>
                            <Textarea
                                id="edit-agent-system-prompt"
                                name="system_prompt"
                                placeholder="Eres un asistente útil..."
                                className="resize-none min-h-[100px]"
                                defaultValue={agent.system_prompt}
                                disabled={isPending}
                                required
                            />
                        </Field>
                        <Field orientation="horizontal">
                            <Button 
                                type="submit" 
                                variant="default" 
                                disabled={isPending}
                            >
                                {isPending ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
