import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendanceHistory, manualAttendance } from "@/lib/api/attendances";
import type { Attendance } from "@/types/FrontendTypes";

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
