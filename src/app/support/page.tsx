import Chat from "@/components/messages/chat";

export default async function SupportPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages?page=1&limit=30`, {
        cache: 'no-store'
    });
    const messagesData = await response.json();
    
    return (
        <div className="p-4 sm:p-8  gap-4  h-svh max-h-svh overflow-hidden flex flex-col">
           <Chat 
                messages={messagesData.data.messages} 
                hasNextPage={messagesData.data.hasNextPage}
                currentPage={messagesData.data.currentPage}
                title="Support Chat"
            />
        </div>
    );
}

