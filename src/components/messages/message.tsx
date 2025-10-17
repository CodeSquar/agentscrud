import { Message as MessageType } from "@/lib/types/message";

export default function Message({ message, index, userId }: { message: MessageType, index: number, userId: string }) {
    const isOwn = message.sender_id === userId;
    
    return (
        <div className={`w-full flex ${isOwn ? "justify-end" : "justify-start"}`} key={index}>
            <div className={`${isOwn ? "bg-neutral-800 self-end" : "bg-neutral-600 text-neutral-200"} h-auto border rounded-md px-3 py-2 text-sm w-max animate-blurred-fade-in animate-duration-200 mt-2`}>
                <div className="flex gap-2 text-xs text-muted-foreground mb-1">
                    <span>{isOwn ? "Tú" : "Otro"}</span>
                    {message.receiver_id && <span>Para: {message.receiver_id}</span>}
                </div>
                <div>{message.content}</div>
            </div>
        </div>
    )
}