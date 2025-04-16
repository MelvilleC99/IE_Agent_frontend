// IncidentLogComponent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

// Define your Finding type based on your DB schema
interface Finding {
    id: number;
    finding_summary: string;
    details: string;
    status?: string;
}

interface IncidentLogComponentProps {
    visible: boolean;
    onClose?: () => Promise<void>;
}

export default function IncidentLogComponent({ visible, onClose }: IncidentLogComponentProps) {
    const [findings, setFindings] = useState<Finding[]>([]);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch findings from the database
    const fetchFindings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from("findings_log").select("*");
            if (error) {
                console.error("Error fetching findings:", error);
            } else {
                setFindings(data || []);
            }
        } catch (err) {
            console.error("Error fetching findings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchFindings();
        }
    }, [visible]);

    // Open the details modal with the selected finding
    const openDetailsModal = (finding: Finding) => {
        setSelectedFinding(finding);
        setShowDetailsModal(true);
    };

    // Close the details modal
    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedFinding(null);
    };

    // Mark a finding as ignored
    const ignoreFinding = async (id: number) => {
        try {
            const { error } = await supabase
                .from("findings_log")
                .update({ status: "ignored" })
                .eq("id", id);
            if (error) {
                console.error("Error ignoring finding:", error);
            } else {
                // Refresh finding list after update
                fetchFindings();
            }
        } catch (err) {
            console.error("Error updating finding:", err);
        }
    };

    // Create a task from the selected finding
    const createTaskFromFinding = (finding: Finding) => {
        // Implement your logic for task creation here
        console.log("Creating task from finding:", finding);
    };

    if (!visible) return null;

    return (
        <Card className="w-full flex flex-col shadow-md border-gray-200">
            <CardHeader className="pb-2 flex justify-between items-center">
                <CardTitle>Open Points</CardTitle>
                {onClose && (
                    <Button
                        variant="outline"
                        onClick={() => onClose().catch(console.error)}
                    >
                        Back to Chat
                    </Button>
                )}
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p>Loading findings...</p>
                    </div>
                ) : findings.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p>No open points found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Finding Summary
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {findings.map((finding) => (
                                // Use a unique identifier directly and ensure it's a string
                                <tr key={`finding-${finding.id || Math.random().toString()}`}>
                                    <td className="px-4 py-2">
                                        {finding.finding_summary && finding.finding_summary.length > 100
                                            ? finding.finding_summary.substring(0, 100) + "..."
                                            : finding.finding_summary || "No summary available"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Button
                                            variant="ghost"
                                            className="text-xs mr-2"
                                            onClick={() => openDetailsModal(finding)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="text-xs mr-2"
                                            onClick={() => ignoreFinding(finding.id)}
                                        >
                                            Ignore
                                        </Button>
                                        <Button
                                            variant="default"
                                            className="text-xs bg-emerald-600 hover:bg-emerald-700"
                                            onClick={() => createTaskFromFinding(finding)}
                                        >
                                            Create Task
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>

            {/* Modal Popup for Finding Details */}
            {showDetailsModal && selectedFinding && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Finding Details</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            {selectedFinding.details || "No details available"}
                        </p>
                        <Button onClick={closeDetailsModal} className="bg-emerald-600 hover:bg-emerald-700">Close</Button>
                    </div>
                </div>
            )}
        </Card>
    );
}