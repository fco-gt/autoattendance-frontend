"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";

import { es } from "date-fns/locale";
import { TrendingUp, RefreshCw } from "lucide-react";

import { useAgencyUsers } from "@/hooks/useAgency";
import { useAttendanceHistory } from "@/hooks/useAttendance";
import { useSchedules } from "@/hooks/useSchedules";
import { AttendanceStatus, UserFrontendStatus } from "@/types/FrontendTypes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { DashboardStats } from "@/components/agency/dashboard/dashboard-stats";
import { AttendanceChart } from "@/components/agency/dashboard/attendance-chart";
import { RecentActivity } from "@/components/agency/dashboard/recent-activity";
import { QuickActions } from "@/components/agency/dashboard/quick-actions";
import { UserOverview } from "@/components/agency/dashboard/user-overview";
import { ScheduleOverview } from "@/components/agency/dashboard/schedule-overview";
import { DashboardSkeleton } from "@/components/agency/dashboard/dashboard-skeleton";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "quarter"
  >("week");
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date();

  const dateRange = useMemo(() => {
    switch (selectedPeriod) {
      case "week":
        return {
          startDate: format(startOfWeek(today, { locale: es }), "yyyy-MM-dd"),
          endDate: format(endOfWeek(today, { locale: es }), "yyyy-MM-dd"),
        };
      case "month":
        return {
          startDate: format(startOfMonth(today), "yyyy-MM-dd"),
          endDate: format(endOfMonth(today), "yyyy-MM-dd"),
        };
      case "quarter":
        return {
          startDate: format(subDays(today, 90), "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
        };
      default:
        return {
          startDate: format(startOfWeek(today, { locale: es }), "yyyy-MM-dd"),
          endDate: format(endOfWeek(today, { locale: es }), "yyyy-MM-dd"),
        };
    }
  }, [selectedPeriod, today]);

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useAgencyUsers();
  const {
    data: attendance,
    isLoading: attendanceLoading,
    refetch: refetchAttendance,
  } = useAttendanceHistory(dateRange);
  const {
    data: schedules,
    isLoading: schedulesLoading,
    refetch: refetchSchedules,
  } = useSchedules();

  const isLoading = usersLoading || attendanceLoading || schedulesLoading;

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    if (!users || !attendance) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        totalAttendance: 0,
        onTimeAttendance: 0,
        lateAttendance: 0,
        attendanceRate: 0,
        punctualityRate: 0,
      };
    }

    const totalUsers = users.length;
    const activeUsers = users.filter(
      (user) => user.status === UserFrontendStatus.ACTIVE
    ).length;
    const pendingUsers = users.filter(
      (user) => user.status === UserFrontendStatus.PENDING
    ).length;

    const totalAttendance = attendance.length;
    const onTimeAttendance = attendance.filter(
      (att) => att.status === AttendanceStatus.ON_TIME
    ).length;
    const lateAttendance = attendance.filter(
      (att) => att.status === AttendanceStatus.LATE
    ).length;

    const attendanceRate =
      totalUsers > 0 ? (totalAttendance / (totalUsers * 7)) * 100 : 0; // Assuming 7 days
    const punctualityRate =
      totalAttendance > 0 ? (onTimeAttendance / totalAttendance) * 100 : 0;

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      totalAttendance,
      onTimeAttendance,
      lateAttendance,
      attendanceRate: Math.round(attendanceRate),
      punctualityRate: Math.round(punctualityRate),
    };
  }, [users, attendance]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchUsers(),
        refetchAttendance(),
        refetchSchedules(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Panel de Control
          </h1>
          <p className="text-muted-foreground">
            Resumen de actividad de tu agencia para{" "}
            {selectedPeriod === "week"
              ? "esta semana"
              : selectedPeriod === "month"
              ? "este mes"
              : "este trimestre"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) =>
              setSelectedPeriod(value as "week" | "month" | "quarter")
            }
          >
            <TabsList>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
              <TabsTrigger value="quarter">Trimestre</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Chart */}
        <div className="lg:col-span-2">
          <AttendanceChart
            attendance={attendance || []}
            period={selectedPeriod}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Secondary Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity attendance={attendance || []} users={users || []} />
        </div>

        {/* User Overview */}
        <UserOverview users={users || []} />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Schedule Overview */}
        <ScheduleOverview schedules={schedules || []} users={users || []} />

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tasa de Asistencia</span>
                <Badge
                  variant={
                    stats.attendanceRate >= 80 ? "default" : "destructive"
                  }
                >
                  {stats.attendanceRate}%
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(stats.attendanceRate, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Puntualidad</span>
                <Badge
                  variant={
                    stats.punctualityRate >= 90 ? "default" : "secondary"
                  }
                >
                  {stats.punctualityRate}%
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${Math.min(stats.punctualityRate, 100)}%` }}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.onTimeAttendance}
                </div>
                <div className="text-xs text-muted-foreground">A Tiempo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.lateAttendance}
                </div>
                <div className="text-xs text-muted-foreground">Tardanzas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
