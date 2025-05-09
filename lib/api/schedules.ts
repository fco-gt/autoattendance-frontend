import { Schedule } from "@/types/FrontendTypes";
import { apiClient } from "./apiClient";

// Create
export const createSchedule = (
  body: Omit<Schedule, "id" | "createdAt" | "updatedAt">
) =>
  apiClient<Schedule>("/schedules", {
    method: "POST",
    body: JSON.stringify(body),
  });

// Read all
export const fetchSchedules = () =>
  apiClient<Schedule[]>("/schedules", { method: "GET" });

// Read one
export const fetchScheduleById = (id: string) =>
  apiClient<Schedule>(`/schedules/${id}`, { method: "GET" });

// Update
export const updateSchedule = (
  id: string,
  patch: Partial<Omit<Schedule, "id" | "agencyId" | "createdAt" | "updatedAt">>
) =>
  apiClient<Schedule>(`/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });

// Delete
export const deleteSchedule = (id: string) =>
  apiClient<void>(`/schedules/${id}`, { method: "DELETE" });
