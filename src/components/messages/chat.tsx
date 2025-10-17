'use client'

import { Badge } from "../ui/badge";
import MessageComponent from "./message";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Message } from "@prisma/client";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface ChatProps {
    roomId?: string;
    messages: Message[];
    hasNextPage: boolean;
    currentPage: number;
    title?: string;
}

export default function Chat({ roomId = "global", messages: initialMessages, hasNextPage: initialHasNextPage, currentPage: initialCurrentPage, title = "Support chat" }: ChatProps) {
    const router = useRouter();

    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [userId, setUserId] = useState<string>('');
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [page, setPage] = useState(initialCurrentPage);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        // simular el id del usuario
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            } else {
                const newUserId = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('userId', newUserId);
                setUserId(newUserId);
            }
        }
    }, []);

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
            path: '/api/socket'
        });

        const socket = socketRef.current;
        setConnected(true);
        socket.emit('joinRoom', roomId);

        socket.on('message', (newMessage: Message) => {
            console.log('message received', newMessage);
            setMessages((prev) => [...prev, newMessage]);
            setTimeout(scrollToBottom, 100);
        });

        const pingInterval = setInterval(() => {
            socket.emit('ping', "ping");
        }, 29000);

        return () => {
            setConnected(false);
            clearInterval(pingInterval);
            socket.off('message');
            socket.disconnect();
        };

    }, [roomId]);

    const handleSendMessage = () => {
        if (socketRef.current && message.trim() && connected && userId) {
            socketRef.current.emit('sendMessage', message, roomId, userId);
            setMessage('');
            setTimeout(scrollToBottom, 100);
        }
    }

    const loadOlderMessages = async () => {
        if (loadingOlder || !hasNextPage) return;
        
        setLoadingOlder(true);
        const nextPage = page + 1;
        
        const previousScrollHeight = messagesContainerRef.current?.scrollHeight || 0;
        
        try {
            const response = await fetch(`/api/messages?page=${nextPage}&limit=30`);
            const data = await response.json();
                        
            setMessages((prev) => [...data.data.messages, ...prev]);
            setHasNextPage(data.data.hasNextPage);
            setPage(nextPage);
            
            requestAnimationFrame(() => {
                if (messagesContainerRef.current) {
                    const newScrollHeight = messagesContainerRef.current.scrollHeight;
                    messagesContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
                }
            });
        } catch (error) {
            console.error('Error loading older messages:', error);
        } finally {
            setLoadingOlder(false);
        }
    }
    return (
        <div className="gap-2 h-svh overflow-hidden flex flex-col">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="size-4" />
                </Button>
                <h2 className="text-xl font-bold">{title}</h2>
                <Badge variant="default" className="bg-green-900 text-green-400">

                    {connected ? "Conectado" : "Desconectado"}
                </Badge>
            </div>
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
                {hasNextPage && (
                    <Button
                        variant="outline"
                        onClick={loadOlderMessages}
                        disabled={loadingOlder}
                    >
                        {loadingOlder ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                            </>
                        ) : (
                            'Cargar mensajes anteriores'
                        )}
                    </Button>
                )}
                {messages?.map((msg, index) => (
                    <MessageComponent message={msg} index={index} userId={userId} key={index} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!connected}><Send className="size-4" /></Button>
            </div>
        </div>


    )
}