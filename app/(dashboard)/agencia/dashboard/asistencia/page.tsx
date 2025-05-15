"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { Calendar, Filter, QrCode, UserCheck, UserX } from "lucide-react";
import {
  useAttendanceHistory,
  useManualAttendance,
  useGenerateQr,
} from "@/hooks/useAttendance";
import { useAgencyUsers } from "@/hooks/useAgency";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/agency/attendances/date-range-picker";
import { AttendanceTable } from "@/components/agency/attendances/attendance-list-table";
import { AttendanceFormDialog } from "@/components/agency/attendances/attendance-form-dialog";
import { AttendanceHistorySkeleton } from "@/components/agency/attendances/attendance-history-skeleton";
import { QRCodeModal } from "@/components/agency/attendances/qr-code-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import type { AttendanceFormValues } from "@/components/agency/attendances/attendance-form-dialog";
import type { DateRange } from "react-day-picker";

export default function AttendancePage() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(today, 7),
    to: today,
  });

  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [attendanceType, setAttendanceType] = useState<
    "check-in" | "check-out"
  >("check-in");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrType, setQrType] = useState<"check-in" | "check-out">("check-in");

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
  const qrMutation = useGenerateQr();

  // Función para abrir el modal de asistencia manual
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

  // Función para generar QR según el tipo
  const handleGenerateQR = (type: "check-in" | "check-out") => {
    setQrType(type);
    qrMutation.mutate(
      { type },
      {
        onSuccess: (data) => {
          setQrCodeValue(data.url);
          setIsQrModalOpen(true);
        },
        onError: (err) => {
          console.error("Error generando QR:", err);
        },
      }
    );
  };

  // Función para obtener el nombre completo del usuario
  const getUserFullName = (userId: string) => {
    const user = users?.find((u) => u.id === userId);
    if (!user) return "Usuario desconocido";
    return `${user.name} ${user.lastname || ""}`.trim();
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Control de Asistencia
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Tabs defaultValue="qr" className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="qr">Código QR</TabsTrigger>
                <TabsTrigger value="manual">Registro Manual</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="mt-2">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleGenerateQR("check-in")}
                    disabled={qrMutation.isPending}
                    className="w-full"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    QR de Entrada
                  </Button>
                  <Button
                    onClick={() => handleGenerateQR("check-out")}
                    disabled={qrMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    QR de Salida
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-2">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => openAttendanceDialog("check-in")}
                    disabled={manual.isPending || usersLoading}
                    className="w-full"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Entrada Manual
                  </Button>
                  <Button
                    onClick={() => openAttendanceDialog("check-out")}
                    disabled={manual.isPending || usersLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Salida Manual
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          {/* Sección de filtros */}
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

          {/* Sección de historial */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Historial de Asistencias
            </h3>

            {isLoading ? (
              <AttendanceHistorySkeleton />
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  No se pudo cargar el historial: {error.message}
                </AlertDescription>
              </Alert>
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

      {/* Modal para marcar asistencia manual */}
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

      {/* Modal para mostrar el código QR */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        value={qrCodeValue}
        title={
          qrType === "check-in" ? "Código QR de Entrada" : "Código QR de Salida"
        }
        size={250}
      />
    </div>
  );
}
