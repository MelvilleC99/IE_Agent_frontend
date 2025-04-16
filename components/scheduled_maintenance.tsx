"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabaseClient";
import { Eye } from "lucide-react";

// Define your ScheduledMaintenance type (ensure it matches your DB schema)
interface ScheduledMaintenance {
    id: number;
    machine_id: string;
    machine_type: string;
    issue_type: string;
    description: string;
    assignee: string;
    mechanic_name: string;
    priority: string;
    status: string;
    due_by: string;
    completed_at?: string;
    notes?: string;
}

interface Mechanic {
    employee_number: string;
    name: string;
    surname: string;
}

export default function ScheduledMaintenancePage() {
    const router = useRouter();

    // States for tasks and filters
    const [tasks, setTasks] = useState<ScheduledMaintenance[]>([]);
    const [filterStatus, setFilterStatus] = useState<"open" | "completed">("open");
    const [mechanicFilter, setMechanicFilter] = useState<string>("All");
    const [priorityFilter, setPriorityFilter] = useState<string>("All");
    const [loading, setLoading] = useState<boolean>(false);
    const [notes, setNotes] = useState<{ [key: number]: string }>({});

    // States for description modal popup
    const [showDescModal, setShowDescModal] = useState<boolean>(false);
    const [descModalContent, setDescModalContent] = useState<string>("");

    // List of mechanics for filtering (populated from mechanics table)
    const [mechanicsList, setMechanicsList] = useState<Mechanic[]>([]);

    // Fetch mechanics list (for filter options)
    const fetchMechanics = async () => {
        try {
            const { data, error } = await supabase
                .from("mechanics")
                .select("*");
            if (error) {
                console.error("Error fetching mechanics: ", error);
            } else {
                setMechanicsList(data || []);
            }
        } catch (err) {
            console.error("Fetch mechanics error: ", err);
        }
    };

    // Fetch tasks, applying all three filters (status, mechanic, priority)
    const fetchTasks = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("scheduled_maintenance")
                .select("*")
                .eq("status", filterStatus);
            if (mechanicFilter !== "All") {
                query = query.eq("mechanic_name", mechanicFilter);
            }
            if (priorityFilter !== "All") {
                query = query.eq("priority", priorityFilter.toLowerCase());
            }
            const { data, error } = await query;
            if (error) {
                console.error("Error fetching tasks: ", error);
            } else {
                setTasks(data || []);
            }
        } catch (err) {
            console.error("Fetch tasks error: ", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, [filterStatus, mechanicFilter, priorityFilter]);

    useEffect(() => {
        fetchMechanics();
    }, []);

    // Open the description modal popup
    const openDescModal = (description: string) => {
        setDescModalContent(description);
        setShowDescModal(true);
    };

    // Mark task as completed
    const markCompleted = async (task: ScheduledMaintenance) => {
        const taskNote = notes[task.id] || "";
        const { error } = await supabase
            .from("scheduled_maintenance")
            .update({
                status: "completed",
                completed_at: new Date().toISOString(),
                notes: taskNote,
            })
            .eq("id", task.id);
        if (error) {
            console.error("Error updating task: ", error);
        } else {
            fetchTasks();
        }
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Scheduled Maintenance Tasks</h1>
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                        Back to Dashboard
                    </Button>
                </div>

                {/* Filter Controls */}
                <div className="mb-4 space-y-4">
                    <div className="space-x-4">
                        <Button
                            variant={filterStatus === "open" ? "default" : "outline"}
                            onClick={() => setFilterStatus("open")}
                        >
                            Open Tasks
                        </Button>
                        <Button
                            variant={filterStatus === "completed" ? "default" : "outline"}
                            onClick={() => setFilterStatus("completed")}
                        >
                            Completed Tasks
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {/* Mechanic Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Filter by Mechanic:</label>
                            <select
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-emerald-500"
                                value={mechanicFilter}
                                onChange={(e) => setMechanicFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                {mechanicsList.map((mech) => {
                                    const fullName = `${mech.name} ${mech.surname}`;
                                    return (
                                        <option key={mech.employee_number} value={fullName}>
                                            {fullName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {/* Priority Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Filter by Priority:</label>
                            <select
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-emerald-500"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Machine Type
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Machine ID
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Assignee
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Priority
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Due Date
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                                    Description
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Notes
                                </th>
                                {filterStatus === "open" && (
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                        Actions
                                    </th>
                                )}
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {tasks.map((task) => (
                                <tr key={task.id}>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {task.machine_type}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {task.machine_id}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {task.assignee} <br />
                                        <span className="text-xs text-gray-600">{task.mechanic_name}</span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {task.priority}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {new Date(task.due_by).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-center">
                                        <Button
                                            variant="ghost"
                                            onClick={() => openDescModal(task.description)}
                                            className="text-xs"
                                        >
                                            View Description
                                        </Button>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {filterStatus === "open" ? (
                                            <Input
                                                value={notes[task.id] || ""}
                                                onChange={(e) =>
                                                    setNotes({ ...notes, [task.id]: e.target.value })
                                                }
                                                placeholder="Add notes..."
                                                className="w-full"
                                            />
                                        ) : (
                                            task.notes || ""
                                        )}
                                    </td>
                                    {filterStatus === "open" && (
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <Button
                                                onClick={() => markCompleted(task)}
                                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                            >
                                                Mark Completed
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Description Modal Popup */}
                {showDescModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Task Description</h2>
                            <p className="text-sm text-gray-700 mb-6">{descModalContent}</p>
                            <Button onClick={() => setShowDescModal(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
