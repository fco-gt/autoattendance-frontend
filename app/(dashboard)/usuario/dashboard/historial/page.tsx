"use client";

import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { useUserAttendanceHistory } from "@/hooks/useAttendance";
import { AttendanceFilters } from "@/components/employee/attendance-history/attendance-filters";
import { AttendanceStats } from "@/components/employee/attendance-history/attendance-stats";
import { PeriodInfo } from "@/components/employee/attendance-history/period-info";
import { AttendanceHistoryTable } from "@/components/employee/attendance-history/attendance-history-table";

import type { DateRange } from "react-day-picker";

export default function UserAttendanceHistoryPage() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(today),
    to: today,
  });

  const apiDateRange = {
    startDate: format(dateRange?.from || startOfMonth(today), "yyyy-MM-dd"),
    endDate: format(dateRange?.to || today, "yyyy-MM-dd"),
  };

  const {
    data: history,
    isLoading,
    error,
    refetch,
  } = useUserAttendanceHistory(apiDateRange);

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Mi Historial de Asistencias
        </h1>
        <p className="text-muted-foreground">
          Revisa tu historial de asistencias y puntualidad
        </p>
      </div>

      {/* Filtros y Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AttendanceFilters dateRange={dateRange} setDateRange={setDateRange} />
        <AttendanceStats history={history} />
      </div>

      {/* Información del período */}
      <PeriodInfo dateRange={dateRange} totalRecords={history?.length || 0} />

      {/* Tabla de Historial */}
      <AttendanceHistoryTable
        history={history}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        dateRange={dateRange}
      />
    </div>
  );
}
