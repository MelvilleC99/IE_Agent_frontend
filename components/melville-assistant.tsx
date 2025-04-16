"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RefreshCw,
  BarChart3,
  Calendar,
  Clock,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function MelvilleAssistant() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
              "Hello, I'm Melville, your industrial engineering assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  // Scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    let aiResponse = "";
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      aiResponse = data.aiResponse || "I'm not sure how to respond to that.";
    } catch (apiError) {
      aiResponse =
          "I apologize, but I'm having trouble connecting to my analysis system right now. Could you please try again in a moment?";
    }

    if (/analysis|report|data|dashboard|metrics|performance/i.test(userInput)) {
      setIsAnalysisMode(true);
    }

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col shadow-md border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle>Factory Manager Chat</CardTitle>
            </CardHeader>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
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
                                message.role === "user" ? "justify-end" : "justify-start"
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
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 border-gray-300 focus-visible:ring-emerald-500"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
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
        </div>

        {/* Right-side Assistant Card and Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-48 w-48 mb-4 ring-4 ring-emerald-50 rounded-full overflow-hidden">
                  <AvatarImage src="/Melville.png" alt="Assistant" className="object-cover" />
                  <AvatarFallback className="text-xl bg-emerald-100 text-emerald-700">
                    MA
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">Melville AI Powered Assistant</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  onClick={() => {
                    if (isLoading) return;
                    setInput("Scheduled Task");
                    setTimeout(() => handleSendMessage(), 0);
                  }}
                  disabled={isLoading}
              >
                <Clock className="h-4 w-4 mr-2" />
                Scheduled Task
              </Button>
              <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  onClick={() => {
                    if (isLoading) return;
                    setInput("Open Points");
                    setTimeout(() => handleSendMessage(), 0);
                  }}
                  disabled={isLoading}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Open Points
              </Button>
              {/* Quick Action for Scheduled Maintenance */}
              <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  onClick={() => router.push("/scheduled_maintenance")}
                  disabled={isLoading}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Scheduled Maintenance
              </Button>
              <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  onClick={() => {
                    setInput("Dashboards");
                    setTimeout(() => handleSendMessage(), 0);
                  }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboards
              </Button>
              <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  onClick={() => {
                    setInput("Advanced Analytics");
                    setTimeout(() => handleSendMessage(), 0);
                  }}
              >
                <Activity className="h-4 w-4 mr-2" />
                Advanced Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
