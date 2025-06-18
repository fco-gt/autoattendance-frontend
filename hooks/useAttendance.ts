import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateQrLink,
  getAttendanceHistory,
  getUserAttendanceToday,
  getUserAttendanceHistory,
  manualAttendance,
} from "@/lib/api/attendances";
import type { Attendance } from "@/types/FrontendTypes";
import { GenerateQrResponse } from "@/types/api";
import { toast } from "sonner";

type ManualAttendanceVariables = Parameters<typeof manualAttendance>[0];

export function useAttendanceHistory(params: {
  startDate: string;
  endDate: string;
  userId?: string;
}) {
  return useQuery<Attendance[], Error>({
    queryKey: ["attendance", params],
    queryFn: () => getAttendanceHistory(params),
  });
}

export function useManualAttendance() {
  const qc = useQueryClient();

  return useMutation<Attendance, Error, ManualAttendanceVariables>({
    mutationFn: (variables) => manualAttendance(variables),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Asistencia registrada correctamente.", {
        duration: 3000,
      });
    },
    onError: (err) => {
      toast.error("Error al registrar la asistencia.", {
        description: err.message,
        duration: 5000,
      });
    },
  });
}

// Hooks para usuarios
export function useUserAttendanceToday() {
  return useQuery<Attendance, Error>({
    queryKey: ["attendanceToday"],
    queryFn: getUserAttendanceToday,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useUserAttendanceHistory(params: {
  startDate: string;
  endDate: string;
}) {
  return useQuery<Attendance[], Error>({
    queryKey: ["attendanceHistory", params],
    queryFn: () => getUserAttendanceHistory(params),
  });
}

export function useGenerateQr() {
  return useMutation<
    GenerateQrResponse,
    Error,
    { type: "check-in" | "check-out" }
  >({
    mutationFn: (variable) => generateQrLink(variable.type),
    onError: (err) => {
      console.log(err);
    },
  });
}
