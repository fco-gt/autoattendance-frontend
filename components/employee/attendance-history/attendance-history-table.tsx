"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Clock, Download, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceHistorySkeleton } from "./attendance-history-skeleton";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import { formatAttendanceTime, formatDate, formatTime, getMethodText } from "@/utils/attendance";
import * as XLSX from "xlsx";

import type { Attendance } from "@/types/FrontendTypes";
import type { DateRange } from "react-day-picker";

interface AttendanceHistoryTableProps {
  history: Attendance[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  dateRange: DateRange | undefined;
}

export function AttendanceHistoryTable({
  history,
  isLoading,
  error,
  refetch,
  dateRange,
}: AttendanceHistoryTableProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = () => {
    if (!history || history.length === 0) return;

    setIsExporting(true);

    try {
      const excelData = history.map((attendance, index) => ({
        "#": index + 1,
        Fecha: formatDate(attendance.date),
        "Entrada Programada": formatTime(attendance.scheduleEntryTime),
        "Entrada Real": formatTime(attendance.checkInTime),
        "Salida Programada": formatTime(attendance.scheduleExitTime),
        "Salida Real": formatTime(attendance.checkOutTime),
        Estado: attendance.status === "ON_TIME" ? "A Tiempo" : "Tarde",
        "Método Entrada": getMethodText(attendance.methodIn),
        "Método Salida": getMethodText(attendance.methodOut),
        Notas: attendance.notes || "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      const columnWidths = [
        { wch: 5 },
        { wch: 15 },
        { wch: 18 },
        { wch: 15 },
        { wch: 18 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
      ];
      worksheet["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Mi Historial");

      const fileName = getExcelFileName(dateRange);
      XLSX.writeFile(workbook, fileName);

      console.log("Archivo exportado exitosamente:", fileName);
    } catch (error) {
      console.error("Error al exportar:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getExcelFileName = (dateRange: DateRange | undefined) => {
    const today = new Date();

    if (!dateRange?.from || !dateRange?.to) {
      return `mi_asistencia_${format(today, "dd-MM-yyyy")}.xlsx`;
    }

    const isToday =
      dateRange.from.toDateString() === today.toDateString() &&
      dateRange.to.toDateString() === today.toDateString();
    const isSameDate =
      dateRange.from.toDateString() === dateRange.to.toDateString();

    if (isToday) {
      return `mi_asistencia_hoy_${format(today, "dd-MM-yyyy")}.xlsx`;
    } else if (isSameDate) {
      return `mi_asistencia_${format(dateRange.from, "dd-MM-yyyy")}.xlsx`;
    } else {
      return `mi_asistencia_${format(dateRange.from, "dd-MM-yyyy")}_a_${format(
        dateRange.to,
        "dd-MM-yyyy"
      )}.xlsx`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Asistencias
          </CardTitle>
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
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <AttendanceHistorySkeleton />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No se pudo cargar tu historial: {error.message}
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        ) : history?.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay registros</h3>
            <p className="text-muted-foreground">
              No tienes registros de asistencia en el período seleccionado
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history?.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell className="font-medium">
                      {formatDate(attendance.date)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {formatAttendanceTime(attendance.checkInTime)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Programada: {formatTime(attendance.scheduleEntryTime)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {formatAttendanceTime(attendance.checkOutTime)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Programada: {formatTime(attendance.scheduleExitTime)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={attendance.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Entrada: {getMethodText(attendance.methodIn)}
                        </div>
                        <div className="text-sm">
                          Salida: {getMethodText(attendance.methodOut)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {attendance.notes || "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
