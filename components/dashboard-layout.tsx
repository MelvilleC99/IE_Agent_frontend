"use client"

import React from "react"
import Link from "next/link"
import { Bell, MessageSquare, LayoutDashboard, BarChart3, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar className="border-r border-gray-200">
            <SidebarHeader className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">PulseView AI</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive>
                        <Link href="/dashboard">
                          <LayoutDashboard />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/analytics">
                          <BarChart3 />
                          <span>Analytics</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/reports">
                          <FileText />
                          <span>Reports</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>FM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Factory Manager</p>
                  <p className="text-xs text-gray-500">manager@factoryinsights.com</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col">
            {/* Header Banner */}
            <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold">Maintenance AI Agent</h2>
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </header>
            <main className="flex-1 p-6 bg-white">{children}</main>
          </div>
        </div>
      </SidebarProvider>
  )
}
