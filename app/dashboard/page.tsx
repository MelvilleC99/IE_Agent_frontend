import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import { MelvilleAssistant } from "@/components/melville-assistant"
import scheduled_maintenance from "@/components/scheduled_maintenance"

export const metadata: Metadata = {
  title: "Melville - Industrial Engineering Assistant",
  description: "AI-powered industrial engineering assistant for factory management",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <MelvilleAssistant />
    </DashboardLayout>
  )
}

