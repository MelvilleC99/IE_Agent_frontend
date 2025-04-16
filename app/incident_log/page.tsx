// app/incident_log/page.tsx
"use client";

import React from "react";
import IncidentLogComponent from "@/components/incident_log";

export default function IncidentLogPage() {
  // This page is still available for direct navigation
  // but the component is also used in the MelvilleAssistant
  return <IncidentLogComponent visible={true} />;
}