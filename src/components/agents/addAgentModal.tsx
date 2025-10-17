"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createAgentAction } from "@/lib/actions/agents";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Frown, Loader2, PlusIcon } from "lucide-react";
import { LLM_MODELS, LLM_MODEL_FORMATTED } from "@/lib/types/agent";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "../ui/select"

export default function AddAgentsModal() {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createAgentAction, { success: false });
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
                <Button size="default"><PlusIcon className="size-4" /> Agregar Agente</Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={() => setOpen(false)} className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Agente</DialogTitle>
                    <DialogDescription>Agregar una nueva configuración de agente a la base de datos</DialogDescription>
                </DialogHeader>

                <form ref={formRef} action={formAction}>
                    <FieldGroup>
                        {state.error && (
                            <Alert variant="destructive">
                                <Frown className="size-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    Hubo un error al agregar el agente
                                </AlertDescription>
                            </Alert>
                        )}
                        <Field>
                            <FieldLabel htmlFor="agent-name">Nombre</FieldLabel>
                            <Input
                                id="agent-name"
                                name="name"
                                type="text"
                                placeholder="Mi Agente Personalizado"
                                required
                                disabled={isPending}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="agent-llm-model">Modelo LLM</FieldLabel>
                            <Select
                                name="llm_model"
                                required
                                disabled={isPending}
                                defaultValue="GPT_5_NANO"
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
                            <FieldLabel htmlFor="agent-temperature">Temperatura (0.0 - 1.0)</FieldLabel>
                            <Input
                                id="agent-temperature"
                                name="temperature"
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                placeholder="0.7"
                                defaultValue="0.7"
                                required
                                disabled={isPending}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="agent-system-prompt">Prompt del Sistema</FieldLabel>
                            <Textarea
                                id="agent-system-prompt"
                                name="system_prompt"
                                placeholder="Eres un asistente útil..."
                                className="resize-none min-h-[100px]"
                                required
                                disabled={isPending}
                            />
                        </Field>
                        <Field orientation="horizontal">
                            <Button
                                type="submit"
                                variant="default"
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="size-4 animate-spin-clockwise" /> : <PlusIcon className="size-4" /> } Agregar Agente
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>

            </DialogContent>
        </Dialog>
    );
}
