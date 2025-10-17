import Chat from "@/components/messages/chat";

export default async function AdminMessagesPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages?page=1&limit=30`, {
        cache: 'no-store'
    });
    const messagesData = await response.json();

    return (
        <div className="p-4 sm:p-8 gap-4 h-svh max-h-svh overflow-hidden flex flex-col">
            <Chat
                initialData={messagesData}
                title="Admin Messages"
            />
        </div>
    );
}

