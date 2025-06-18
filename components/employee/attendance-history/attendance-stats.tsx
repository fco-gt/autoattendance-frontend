"use client";

import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceStatus } from "@/types/FrontendTypes";
import type { Attendance } from "@/types/FrontendTypes";

interface AttendanceStatsProps {
  history: Attendance[] | undefined;
}

export function AttendanceStats({ history }: AttendanceStatsProps) {
  const stats = history
    ? {
        total: history.length,
        onTime: history.filter((a) => a.status === AttendanceStatus.ON_TIME)
          .length,
        late: history.filter((a) => a.status === AttendanceStatus.LATE).length,
      }
    : { total: 0, onTime: 0, late: 0 };

  return (
    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="flex flex-col items-center justify-center">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                A Tiempo
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.onTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tarde</p>
              <p className="text-2xl font-bold text-red-600">{stats.late}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
