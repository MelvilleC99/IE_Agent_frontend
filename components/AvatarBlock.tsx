// AvatarBlock.tsx
"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function AvatarBlock() {
    return (
        <Card>
            <CardContent>
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-48 w-48 mb-4 ring-4 ring-emerald-50 rounded-full overflow-hidden">
                        <AvatarImage
                            src="/Melville.png"
                            alt="Assistant"
                            className="object-cover"
                        />
                        <AvatarFallback className="text-xl bg-emerald-100 text-emerald-700">
                            MA
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-lg">
                        Melville AI Powered Assistant
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}