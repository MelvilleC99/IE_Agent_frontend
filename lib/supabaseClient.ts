// /lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Define the row type for your scheduled_maintenance table
export interface ScheduledMaintenance {
    id: number;
    machine_id: string;
    issue_type: string;
    description: string;
    assignee: string;
    priority: string;
    status: string;
    due_by: string;
    completed_at?: string;
    notes?: string;
}

// Define your database schema interface
export interface Database {
    public: {
        Tables: {
            scheduled_maintenance: {
                Row: ScheduledMaintenance;
                Insert: Partial<ScheduledMaintenance>;
                Update: Partial<ScheduledMaintenance>;
            };
            // You can add other table definitions here
        };
    };
}

// Use environment variables (remember to prefix with NEXT_PUBLIC_ for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
