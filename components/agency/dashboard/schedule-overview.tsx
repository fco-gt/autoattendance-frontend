"use client";

import { useMemo } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Schedule, UserFrontend } from "@/types/FrontendTypes";

interface ScheduleOverviewProps {
  schedules: Schedule[];
  users: UserFrontend[];
}

export function ScheduleOverview({ schedules }: ScheduleOverviewProps) {
  const scheduleStats = useMemo(() => {
    const total = schedules.length;
    const defaultSchedules = schedules.filter(
      (schedule) => schedule.isDefault
    ).length;
    const totalAssignedUsers = schedules.reduce(
      (acc, schedule) => acc + schedule.assignedUsersIds.length,
      0
    );

    return {
      total,
      defaultSchedules,
      totalAssignedUsers,
    };
  }, [schedules]);

  const getDayName = (day: number) => {
    day -= 1; // Adjust for Sunday
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    return days[day] || "?";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Horarios de Trabajo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schedule Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{scheduleStats.total}</div>
            <div className="text-xs text-muted-foreground">Horarios</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {scheduleStats.defaultSchedules}
            </div>
            <div className="text-xs text-muted-foreground">Por Defecto</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {scheduleStats.totalAssignedUsers}
            </div>
            <div className="text-xs text-muted-foreground">Asignaciones</div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Horarios Activos</h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{schedule.name}</h5>
                    {schedule.isDefault && (
                      <Badge variant="default">Por Defecto</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {schedule.entryTime} - {schedule.exitTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {schedule.assignedUsersIds.length} usuarios
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {schedule.daysOfWeek.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {getDayName(day)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay horarios configurados</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
