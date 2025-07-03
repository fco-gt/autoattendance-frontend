"use client";

import { Users, Clock, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalAttendance: number;
    onTimeAttendance: number;
    lateAttendance: number;
    attendanceRate: number;
    punctualityRate: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Usuarios",
      value: stats.totalUsers,
      icon: Users,
      description: `${stats.activeUsers} activos, ${stats.pendingUsers} pendientes`,
      trend: stats.activeUsers > stats.pendingUsers ? "positive" : "neutral",
      color: "blue",
    },
    {
      title: "Asistencias",
      value: stats.totalAttendance,
      icon: Calendar,
      description: "Registros totales",
      trend: stats.totalAttendance > 0 ? "positive" : "neutral",
      color: "green",
    },
    {
      title: "Puntualidad",
      value: `${stats.punctualityRate}%`,
      icon: Clock,
      description: `${stats.onTimeAttendance} a tiempo`,
      trend:
        stats.punctualityRate >= 90
          ? "positive"
          : stats.punctualityRate >= 70
          ? "neutral"
          : "negative",
      color: "purple",
    },
    {
      title: "Tasa de Asistencia",
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      description: "Promedio semanal",
      trend:
        stats.attendanceRate >= 80
          ? "positive"
          : stats.attendanceRate >= 60
          ? "neutral"
          : "negative",
      color: "orange",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-full ${
                  stat.color === "blue"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : stat.color === "green"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : stat.color === "purple"
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                    : "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                }`}
              >
                <IconComponent className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Badge
                  variant={
                    stat.trend === "positive"
                      ? "default"
                      : stat.trend === "negative"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {stat.trend === "positive"
                    ? "↗"
                    : stat.trend === "negative"
                    ? "↘"
                    : "→"}
                </Badge>
              </div>
            </CardContent>
            <div
              className={`absolute bottom-0 left-0 h-1 w-full ${
                stat.color === "blue"
                  ? "bg-blue-500"
                  : stat.color === "green"
                  ? "bg-green-500"
                  : stat.color === "purple"
                  ? "bg-purple-500"
                  : "bg-orange-500"
              }`}
            />
          </Card>
        );
      })}
    </div>
  );
}
