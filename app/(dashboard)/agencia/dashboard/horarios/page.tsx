"use client";

import { useSchedules, useDeleteSchedule } from "@/hooks/useSchedules";
import ScheduleList from "@/components/schedules/schedule-list-table";

export default function ScheduleListPage() {
  const { data: schedules, isLoading } = useSchedules();
  const deleteMutation = useDeleteSchedule();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {schedules && (
        <ScheduleList
          schedules={schedules}
          handleDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
