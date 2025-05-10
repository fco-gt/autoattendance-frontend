import { Attendance } from "@/types/FrontendTypes";
import { apiClient } from "./apiClient";

// Manual
export async function manualAttendance(body: {
  userId: string;
  type: "check-in" | "check-out";
  notes?: string;
}): Promise<Attendance> {
  return apiClient<Attendance>("attendance/manual", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Get History
export async function getAttendanceHistory(params: {
  startDate: string;
  endDate: string;
  userId?: string;
}) {
  const query = new URLSearchParams(params as Record<string, string>);

  return apiClient<Attendance[]>(`/attendance/history/agency?${query}`, {
    method: "GET",
  });
}

// Get User Attendance Today
export function getUserAttendanceToday(): Promise<Attendance> {
  return apiClient<Attendance>("/attendance/today", {
    method: "GET",
  });
}
