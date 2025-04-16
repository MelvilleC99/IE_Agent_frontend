// MelvilleAssistant.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatInterface } from "./ChatInterface";
import { AvatarBlock } from "./AvatarBlock";
import { QuickActions } from "./QuickActions";
import IncidentLogComponent from "@/components/incident_log";
import ScheduledMaintenanceComponent from "./scheduled_maintenance";

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
  const [currentView, setCurrentView] = useState<"chat" | "incidents" | "maintenance">("chat");
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // For backward compatibility with TabsInterface
  const [activeTab, setActiveTab] = useState("chat");

  const handleTabChange = async (value: string): Promise<void> => {
    setActiveTab(value);
  };

  // Initialize welcome message only once.
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

  const handleSendMessage = async (): Promise<void> => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Append user message to chat.
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

    // Switch to analysis mode if the query contains keywords.
    if (/analysis|report|data|dashboard|metrics|performance/i.test(userInput)) {
      setIsAnalysisMode(true);
    }

    // Append assistant reply.
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleInputChange = async (value: string): Promise<void> => {
    setInput(value);
  };

  // Callback for Quick Action buttons
  const handleQuickAction = async (value: string): Promise<void> => {
    // If dashboard or analytics is clicked, switch back to chat view
    setCurrentView("chat");
    setInput(value);
    // Wait for state update to complete before sending
    setTimeout(() => handleSendMessage(), 0);
  };

  const handleViewChange = async (view: "chat" | "incidents" | "maintenance"): Promise<void> => {
    setCurrentView(view);
  };

  // Function to go back to chat from other views
  const handleReturnToChat = async (): Promise<void> => {
    setCurrentView("chat");
  };

  return (
      <div className="w-full">
        {currentView === "chat" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ChatInterface
                    messages={messages}
                    input={input}
                    isLoading={isLoading}
                    isAnalysisMode={isAnalysisMode}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onInputChange={handleInputChange}
                    onSendMessage={handleSendMessage}
                    visible={true}
                />
              </div>
              <div className="space-y-6">
                <AvatarBlock />
                <QuickActions
                    isLoading={isLoading}
                    onQuickAction={handleQuickAction}
                    onViewChange={handleViewChange}
                />
              </div>
            </div>
        )}

        {currentView === "incidents" && (
            <div className="w-full">
              <IncidentLogComponent
                  visible={true}
                  onClose={handleReturnToChat}
              />
            </div>
        )}

        {currentView === "maintenance" && (
            <div className="w-full">
              <ScheduledMaintenanceComponent
                  visible={true}
                  onClose={handleReturnToChat}
              />
            </div>
        )}
      </div>
  );
}