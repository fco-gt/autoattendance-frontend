import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSchedules,
  fetchScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "@/lib/api/schedules";
import type { Schedule as ScheduleServiceType } from "@/types/FrontendTypes";
import { toast } from "sonner";

export type Schedule = ScheduleServiceType;

export function useSchedules() {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });
}

export function useSchedule(id: string) {
  return useQuery<Schedule, Error>({
    queryKey: ["schedules", id],
    queryFn: () => fetchScheduleById(id),
    enabled: Boolean(id),
  });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation<
    Schedule,
    Error,
    Omit<Schedule, "id" | "createdAt" | "updatedAt">
  >({
    mutationFn: (newSchedule) => createSchedule(newSchedule),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Horario creado correctamente.", {
        duration: 5000,
      });
    },
    onError: (err) => {
      toast.error("Error al crear el horario.", {
        description: err.message,
        duration: 5000,
      });
    },
  });
}

type UpdateScheduleVariables = {
  id: string;
  data: Partial<Omit<Schedule, "id" | "agencyId" | "createdAt" | "updatedAt">>;
};

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation<Schedule, Error, UpdateScheduleVariables>({
    mutationFn: ({ id, data }) => updateSchedule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteSchedule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}
