// QuickActions.tsx
"use client";

import React from "react";
import { Clock, BarChart3, Calendar, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
    isLoading: boolean;
    onQuickAction: (value: string) => Promise<void>;
    onViewChange: (view: "chat" | "incidents" | "maintenance") => Promise<void>;
}

export function QuickActions({ isLoading, onQuickAction, onViewChange }: QuickActionsProps) {
    const router = useRouter();

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    onClick={async () => await onQuickAction("Scheduled Task")}
                    disabled={isLoading}
                >
                    <Clock className="h-4 w-4 mr-2" />
                    Scheduled Task
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    onClick={() => onViewChange("incidents").catch(console.error)}
                    disabled={isLoading}
                >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Open Points
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    onClick={() => onViewChange("maintenance").catch(console.error)}
                    disabled={isLoading}
                >
                    <Calendar className="h-4 w-4 mr-2" />
                    Scheduled Maintenance
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    onClick={async () => await onQuickAction("Dashboards")}
                    disabled={isLoading}
                >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboards
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    onClick={async () => await onQuickAction("Advanced Analytics")}
                    disabled={isLoading}
                >
                    <Activity className="h-4 w-4 mr-2" />
                    Advanced Analytics
                </Button>
            </CardContent>
        </Card>
    );
}