// ChatInterface.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

interface ChatInterfaceProps {
    messages: Message[];
    input: string;
    isLoading: boolean;
    isAnalysisMode: boolean;
    activeTab: string;
    onTabChange: (value: string) => Promise<void>;
    onInputChange: (value: string) => Promise<void>;
    onSendMessage: () => Promise<void>;
    visible: boolean;
}

export function ChatInterface({
                                  messages,
                                  input,
                                  isLoading,
                                  isAnalysisMode,
                                  activeTab,
                                  onTabChange,
                                  onInputChange,
                                  onSendMessage,
                                  visible
                              }: ChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll chat to bottom whenever messages update.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage().catch(console.error);
        }
    };

    if (!visible) return null;

    return (
        <Card className="h-[600px] flex flex-col shadow-md border-gray-200">
            <CardHeader className="pb-2">
                <CardTitle>Factory Manager Chat</CardTitle>
            </CardHeader>
            <Tabs
                value={activeTab}
                onValueChange={(value) => onTabChange(value).catch(console.error)}
                className="flex-1 flex flex-col"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 px-6 py-4">
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`flex gap-4 max-w-[85%] ${
                                            message.role === "user" ? "flex-row-reverse" : ""
                                        }`}
                                    >
                                        {message.role === "assistant" && (
                                            <Avatar className="h-10 w-10 mt-1 rounded-full overflow-hidden">
                                                <AvatarImage
                                                    src="/placeholder-user.jpg"
                                                    alt="Assistant"
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                                    ME
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`rounded-2xl px-5 py-3 shadow-sm ${
                                                message.role === "user"
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                                            }`}
                                        >
                                            <p className="leading-relaxed">{message.content}</p>
                                            <p
                                                className="text-xs opacity-70 mt-2 text-right"
                                                suppressHydrationWarning
                                            >
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        {message.role === "user" && (
                                            <Avatar className="h-10 w-10 mt-1 rounded-full overflow-hidden">
                                                <AvatarFallback className="bg-gray-200">
                                                    FM
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                    {isAnalysisMode && (
                        <div className="p-4 bg-emerald-50 border-t border-emerald-100">
              <span className="text-sm font-medium text-emerald-800">
                Analysis Results Available
              </span>
                        </div>
                    )}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2 max-w-3xl mx-auto">
                            <Input
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => onInputChange(e.target.value).catch(console.error)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 border-gray-300 focus-visible:ring-emerald-500"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={() => onSendMessage().catch(console.error)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={isLoading || !input.trim()}
                            >
                                {isLoading ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="analysis" className="flex-1">
                    {/* Analysis tab left blank for now */}
                </TabsContent>
            </Tabs>
        </Card>
    );
}