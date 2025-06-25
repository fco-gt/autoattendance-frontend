"use client";

import { useSchedules, useDeleteSchedule } from "@/hooks/useSchedules";
import ScheduleList from "@/components/agency/schedules/schedule-list-table";
import { ScheduleListPageSkeleton } from "@/components/agency/schedules/schedule-list-page-skeleton";

export default function ScheduleListPage() {
  const { data: schedules, isLoading } = useSchedules();
  const deleteMutation = useDeleteSchedule();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <ScheduleListPageSkeleton />;
  }

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
