"use client";

import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import type { DateRange } from "react-day-picker";

interface PeriodInfoProps {
  dateRange: DateRange | undefined;
  totalRecords: number;
}

export function PeriodInfo({ dateRange, totalRecords }: PeriodInfoProps) {
  const today = new Date();

  if (!dateRange?.from || !dateRange?.to) return null;
  const { from, to } = dateRange; // <-- Aquí

  const isToday = isSameDay(from, today) && isSameDay(to, today);
  const isSameDate = isSameDay(from, to);

  const getTitle = () => {
    if (isToday) return "📅 Asistencias de Hoy";
    if (isSameDate) return "📊 Asistencias del Día";
    return "📊 Período Seleccionado";
  };

  const getDescription = () => {
    if (isToday) {
      return `Mostrando tus asistencias del día ${format(
        today,
        "dd 'de' MMMM 'de' yyyy",
        { locale: es }
      )}`;
    }
    if (isSameDate) {
      return `Mostrando tus asistencias del día ${format(
        from,
        "dd 'de' MMMM 'de' yyyy",
        { locale: es }
      )}`;
    }
    return `Mostrando registros desde ${format(
      from,
      "dd/MM/yyyy"
    )} hasta ${format(to, "dd/MM/yyyy")}`;
  };

  return (
    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              {getTitle()}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {getDescription()}
            </p>
            {totalRecords > 0 && (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                Total de registros: {totalRecords}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
