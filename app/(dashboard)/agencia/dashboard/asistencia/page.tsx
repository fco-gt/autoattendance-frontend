"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar, Filter, QrCode, UserCheck, UserX } from "lucide-react";
import {
  useAttendanceHistory,
  useManualAttendance,
  useGenerateQr,
} from "@/hooks/useAttendance";
import { useAgencyUsers } from "@/hooks/useAgency";
import * as XLSX from "xlsx";
import { AttendanceStatus, AttendanceMethod } from "@/types/FrontendTypes";

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
    from: today,
    to: today,
  });

  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [attendanceType, setAttendanceType] = useState<
    "check-in" | "check-out"
  >("check-in");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrType, setQrType] = useState<"check-in" | "check-out">("check-in");
  const [isExporting, setIsExporting] = useState(false);

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

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (!history || history.length === 0) {
      return;
    }

    setIsExporting(true);

    try {
      // Preparar los datos para Excel
      const excelData = history.map((attendance, index) => ({
        "#": index + 1,
        Fecha: attendance.date, // Ya viene en formato YYYY-MM-DD
        Usuario: getUserFullName(attendance.userId),
        "Entrada Programada": attendance.scheduleEntryTime,
        "Entrada Real": attendance.checkInTime,
        "Salida Programada": attendance.scheduleExitTime,
        "Salida Real": attendance.checkOutTime,
        Estado:
          attendance.status === AttendanceStatus.ON_TIME ? "A Tiempo" : "Tarde",
        "Método Entrada":
          attendance.methodIn === AttendanceMethod.MANUAL
            ? "Manual"
            : attendance.methodIn === AttendanceMethod.QR
            ? "QR"
            : attendance.methodIn === AttendanceMethod.NFC
            ? "NFC"
            : "-",
        "Método Salida":
          attendance.methodOut === AttendanceMethod.MANUAL
            ? "Manual"
            : attendance.methodOut === AttendanceMethod.QR
            ? "QR"
            : attendance.methodOut === AttendanceMethod.NFC
            ? "NFC"
            : "-",
        Notas: attendance.notes || "-",
      }));

      // Crear el libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 5 }, // #
        { wch: 12 }, // Fecha
        { wch: 25 }, // Usuario
        { wch: 15 }, // Entrada Programada
        { wch: 15 }, // Entrada Real
        { wch: 15 }, // Salida Programada
        { wch: 15 }, // Salida Real
        { wch: 12 }, // Estado
        { wch: 15 }, // Método Entrada
        { wch: 15 }, // Método Salida
        { wch: 30 }, // Notas
      ];
      worksheet["!cols"] = columnWidths;

      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");

      // Generar el nombre del archivo
      const fileName = (() => {
        const isToday =
          dateRange?.from &&
          dateRange?.to &&
          isSameDay(dateRange.from, today) &&
          isSameDay(dateRange.to, today);
        const isSameDate =
          dateRange?.from &&
          dateRange?.to &&
          isSameDay(dateRange.from, dateRange.to);

        if (isToday) {
          return `asistencias_hoy_${format(today, "dd-MM-yyyy")}.xlsx`;
        } else if (isSameDate && dateRange?.from) {
          return `asistencias_${format(dateRange.from, "dd-MM-yyyy")}.xlsx`;
        } else if (dateRange?.from && dateRange?.to) {
          return `asistencias_${format(
            dateRange.from,
            "dd-MM-yyyy"
          )}_a_${format(dateRange.to, "dd-MM-yyyy")}.xlsx`;
        } else {
          return `asistencias_${format(today, "dd-MM-yyyy")}.xlsx`;
        }
      })();

      // Descargar el archivo
      XLSX.writeFile(workbook, fileName);

      // Mostrar mensaje de éxito (opcional - puedes usar toast si tienes configurado)
      console.log("Archivo exportado exitosamente:", fileName);
    } catch (error) {
      console.error("Error al exportar:", error);
      // Aquí podrías mostrar un toast de error si tienes configurado
    } finally {
      setIsExporting(false);
    }
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
            {dateRange?.from && dateRange?.to && (
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {(() => {
                        const isToday =
                          isSameDay(dateRange.from, today) &&
                          isSameDay(dateRange.to, today);
                        const isSameDate = isSameDay(
                          dateRange.from,
                          dateRange.to
                        );

                        if (isToday) {
                          return "📅 Registro de Hoy";
                        } else if (isSameDate) {
                          return "📊 Registro del Día";
                        } else {
                          return "📊 Período Seleccionado";
                        }
                      })()}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {(() => {
                        const isToday =
                          isSameDay(dateRange.from, today) &&
                          isSameDay(dateRange.to, today);
                        const isSameDate = isSameDay(
                          dateRange.from,
                          dateRange.to
                        );

                        if (isToday) {
                          return `Visualizando las asistencias del día ${format(
                            today,
                            "dd/MM/yyyy"
                          )}`;
                        } else if (isSameDate) {
                          return `Visualizando las asistencias del día ${format(
                            dateRange.from,
                            "dd/MM/yyyy"
                          )}`;
                        } else {
                          return `Visualizando registros desde ${format(
                            dateRange.from,
                            "dd/MM/yyyy"
                          )} hasta ${format(dateRange.to, "dd/MM/yyyy")}`;
                        }
                      })()}
                    </p>
                    {history && history.length > 0 && (
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                        Total de registros: {history.length}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <h3 className="text-lg font-medium mb-2 flex items-center text-slate-900 dark:text-slate-100">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Historial de Asistencias
              </h3>

              {history && history.length > 0 && (
                <Button
                  onClick={exportToExcel}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Exportar a Excel
                    </>
                  )}
                </Button>
              )}
            </div>

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
