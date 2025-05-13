"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { Calendar, Filter, UserCheck, UserX } from "lucide-react";
import {
  useAttendanceHistory,
  useManualAttendance,
} from "@/hooks/useAttendance";
import { useAgencyUsers } from "@/hooks/useAgency";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/agency/attendances/date-range-picker";
import { AttendanceTable } from "@/components/agency/attendances/attendance-list-table";
import { AttendanceFormDialog } from "@/components/agency/attendances/attendance-form-dialog";
import { AttendanceHistorySkeleton } from "@/components/agency/attendances/attendance-history-skeleton";
import { DateRange } from "react-day-picker";

import type { AttendanceFormValues } from "@/components/agency/attendances/attendance-form-dialog";

export default function AttendancePage() {
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [attendanceType, setAttendanceType] = useState<
    "check-in" | "check-out"
  >("check-in");

  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(today, 7),
    to: today,
  });

  const apiDateRange = {
    startDate: format(dateRange?.from || today, "yyyy-MM-dd"),
    endDate: format(dateRange?.to || today, "yyyy-MM-dd"),
  };
  const {
    data: history,
    isLoading,
    error,
  } = useAttendanceHistory(apiDateRange);
  const { data: users, isLoading: usersLoading } = useAgencyUsers();
  const manual = useManualAttendance();

  // Función para abrir el modal de asistencia
  const openAttendanceDialog = (type: "check-in" | "check-out") => {
    setAttendanceType(type);
    setIsAttendanceDialogOpen(true);
  };

  // Función para manejar el envío del formulario de asistencia
  const handleAttendanceSubmit = (data: AttendanceFormValues) => {
    return manual.mutateAsync({
      userId: data.userId,
      type: attendanceType,
      notes: data.notes,
    });
  };

  // Función para obtener el nombre completo del usuario
  const getUserFullName = (userId: string) => {
    const user = users?.find((u) => u.id === userId);
    if (!user) return "Usuario desconocido";
    return `${user.name} ${user.lastname || ""}`;
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Control de Asistencia
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              onClick={() => openAttendanceDialog("check-in")}
              disabled={manual.isPending || usersLoading}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Marcar Entrada
            </Button>
            <Button
              onClick={() => openAttendanceDialog("check-out")}
              disabled={manual.isPending || usersLoading}
              variant="outline"
            >
              <UserX className="mr-2 h-4 w-4" />
              Marcar Salida
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Historial de Asistencias
            </h3>

            {isLoading ? (
              <AttendanceHistorySkeleton />
            ) : error ? (
              <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
                Error al cargar el historial: {error.message}
              </div>
            ) : history?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay registros de asistencia en el período seleccionado
              </div>
            ) : (
              <AttendanceTable
                attendances={history || []}
                getUserName={getUserFullName}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para marcar asistencia */}
      <AttendanceFormDialog
        open={isAttendanceDialogOpen}
        onOpenChange={setIsAttendanceDialogOpen}
        onSubmit={handleAttendanceSubmit}
        title={
          attendanceType === "check-in" ? "Marcar Entrada" : "Marcar Salida"
        }
        description={`Registrar ${
          attendanceType === "check-in" ? "entrada" : "salida"
        } manual para un usuario`}
        type={attendanceType}
        users={users || []}
        isLoading={usersLoading || manual.isPending}
      />
    </div>
  );
}
