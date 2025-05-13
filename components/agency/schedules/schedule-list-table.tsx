"use client";

import { useState } from "react";
import {
  useDeleteSchedule,
  useCreateSchedule,
  useUpdateSchedule,
} from "@/hooks/useSchedules";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleListSkeleton } from "./schedule-list-skeleton";
import {
  ScheduleFormDialog,
  ScheduleFormValues,
} from "@/components/schedules/schedule-form-dialog";
import type {
  CreateSchedulePayload,
  Schedule,
  UpdateSchedulePayload,
} from "@/types/FrontendTypes";
import { getDayNames } from "@/utils/scheduleDaysFormat";
import { useAuthStore } from "@/stores/useAuth";

export default function ScheduleListPage({
  schedules,
  handleDelete,
  isLoading,
}: {
  schedules: Schedule[];
  handleDelete: (id: string) => void;
  isLoading: boolean;
}) {
  const { subject } = useAuthStore();
  const deleteMutation = useDeleteSchedule();
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();

  const agencyId = subject?.type === "agency" ? subject.data.id : undefined;

  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmit = (data: UpdateSchedulePayload) => {
    if (!selectedSchedule) return Promise.reject("No schedule selected");
    return updateMutation.mutateAsync({ id: selectedSchedule.id, data });
  };

  const wrappedCreate = async (formValues: ScheduleFormValues) => {
    if (!agencyId) {
      return Promise.reject("No agency selected");
    }

    const payload: CreateSchedulePayload = {
      agencyId: agencyId,
      name: formValues.name,
      daysOfWeek: formValues.daysOfWeek,
      entryTime: formValues.entryTime,
      exitTime: formValues.exitTime,
      gracePeriodMinutes: formValues.gracePeriodMinutes,
      isDefault: formValues.isDefault,
      assignedUsersIds: [],
    };

    return createMutation.mutateAsync(payload);
  };

  if (isLoading) return <ScheduleListSkeleton />;

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Horarios</CardTitle>
          <Button onClick={() => setIsNewDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Horario
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Tolerancia</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No hay horarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                schedules?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      {s.name}
                      {s.isDefault && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Predeterminado
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getDayNames(s.daysOfWeek)}</TableCell>
                    <TableCell>{s.entryTime}</TableCell>
                    <TableCell>{s.exitTime}</TableCell>
                    <TableCell>{s.gracePeriodMinutes} min</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(s)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(s.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para Nuevo Horario */}
      <ScheduleFormDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSubmit={wrappedCreate}
        title="Crear Nuevo Horario"
        description="Completa los detalles para crear un nuevo horario de trabajo."
      />

      {/* Modal para Editar Horario */}
      {selectedSchedule && (
        <ScheduleFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          schedule={selectedSchedule}
          onSubmit={handleUpdateSubmit}
          title="Editar Horario"
          description="Modifica los detalles del horario seleccionado."
        />
      )}
    </div>
  );
}
