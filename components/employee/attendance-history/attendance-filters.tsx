"use client";

import { subDays, startOfMonth, endOfMonth } from "date-fns";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/agency/attendances/date-range-picker";

import type { DateRange } from "react-day-picker";

interface AttendanceFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

export function AttendanceFilters({
  dateRange,
  setDateRange,
}: AttendanceFiltersProps) {
  const today = new Date();

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Rango de fechas
            </label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange({ from: today, to: today })}
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setDateRange({ from: subDays(today, 7), to: today })
              }
            >
              Última semana
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setDateRange({
                  from: startOfMonth(today),
                  to: endOfMonth(today),
                })
              }
            >
              Este mes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
