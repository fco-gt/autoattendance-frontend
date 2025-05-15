import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateQrLink,
  getAttendanceHistory,
  getUserAttendanceToday,
  manualAttendance,
} from "@/lib/api/attendances";
import type { Attendance } from "@/types/FrontendTypes";
import { GenerateQrResponse } from "@/types/api";

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
