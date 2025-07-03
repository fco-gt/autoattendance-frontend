"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AttendanceStatus,
  type Attendance,
  type UserFrontend,
} from "@/types/FrontendTypes";

interface RecentActivityProps {
  attendance: Attendance[];
  users: UserFrontend[];
}

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  status: AttendanceStatus;
  type: "check-in" | "check-out";
  method: string | null;
}

export function RecentActivity({ attendance, users }: RecentActivityProps) {
  const recentActivities = useMemo(() => {
    if (!attendance || !users || attendance.length === 0) {
      return [];
    }

    const activities: Activity[] = [];

    // Procesar registros de entrada (check-in)
    attendance
      .filter((att) => att && att.id && att.userId && att.checkInTime) // Filtrar elementos válidos con checkInTime
      .forEach((att) => {
        const user = users.find((u) => u && u.id === att.userId);
        activities.push({
          id: `${att.id}-checkin`,
          user: user
            ? `${user.name || ""} ${user.lastname || ""}`.trim() ||
              "Usuario sin nombre"
            : "Usuario desconocido",
          action: "Entrada registrada",
          time: att.checkInTime,
          status: att.status,
          type: "check-in" as const,
          method: att.methodIn,
        });
      });

    // Procesar registros de salida (check-out) si existen
    attendance
      .filter((att) => att && att.id && att.userId && att.checkOutTime) // Filtrar elementos válidos con checkOutTime
      .forEach((att) => {
        const user = users.find((u) => u && u.id === att.userId);
        activities.push({
          id: `${att.id}-checkout`,
          user: user
            ? `${user.name || ""} ${user.lastname || ""}`.trim() ||
              "Usuario sin nombre"
            : "Usuario desconocido",
          action: "Salida registrada",
          time: att.checkOutTime!,
          status: att.status,
          type: "check-out" as const,
          method: att.methodOut,
        });
      });

    // Ordenar por fecha/hora más reciente y tomar los últimos 10
    return activities
      .filter((activity) => activity.time && typeof activity.time === "string") // Filtrar actividades sin tiempo válido
      .sort((a, b) => {
        try {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        } catch (error) {
          console.warn("Error sorting activities by time:", error);
          return 0;
        }
      })
      .slice(0, 10); // Tomar los últimos 10
  }, [attendance, users]);

  const getActivityIcon = (type: string, status?: AttendanceStatus) => {
    if (type === "check-in") {
      return status === AttendanceStatus.ON_TIME ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      );
    } else if (type === "check-out") {
      return <Clock className="h-4 w-4 text-blue-600" />;
    }
    return <Activity className="h-4 w-4" />;
  };

  const getStatusBadge = (status: AttendanceStatus, type: string) => {
    if (type === "check-out") {
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 hover:bg-blue-200"
        >
          Salida
        </Badge>
      );
    }

    return status === AttendanceStatus.ON_TIME ? (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 hover:bg-green-200"
      >
        A Tiempo
      </Badge>
    ) : (
      <Badge variant="destructive">Tarde</Badge>
    );
  };

  const getMethodText = (method: string | null) => {
    if (!method) return "";
    switch (method) {
      case "MANUAL":
        return "Manual";
      case "QR":
        return "QR";
      case "NFC":
        return "NFC";
      case "TELEWORK":
        return "Teletrabajo";
      default:
        return method;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  <div className="p-2 rounded-full bg-background">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{activity.user}</p>
                      {getStatusBadge(activity.status, activity.type)}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                      {activity.method && (
                        <Badge variant="secondary" className="text-xs">
                          {getMethodText(activity.method)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(() => {
                        try {
                          return format(
                            parseISO(activity.time),
                            "dd MMM, HH:mm",
                            { locale: es }
                          );
                        } catch (error) {
                          console.warn(
                            "Error formatting date:",
                            activity.time,
                            error
                          );
                          return activity.time;
                        }
                      })()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
