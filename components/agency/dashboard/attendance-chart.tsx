"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChartIcon } from "lucide-react";
import { AttendanceStatus, type Attendance } from "@/types/FrontendTypes";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface AttendanceChartProps {
  attendance: Attendance[];
  period: "week" | "month" | "quarter";
}

const COLORS = {
  onTime: "#10b981",
  late: "#ef4444",
  absent: "#6b7280",
};

export function AttendanceChart({ attendance }: AttendanceChartProps) {
  const chartData = useMemo(() => {
    if (!attendance || attendance.length === 0) return [];

    const attendanceByDate = attendance.reduce((acc, att) => {
      if (!att.date || typeof att.date !== "string") return acc;

      const date = att.date;
      if (!acc[date]) {
        acc[date] = { date, onTime: 0, late: 0, total: 0 };
      }
      acc[date].total++;
      if (att.status === AttendanceStatus.ON_TIME) {
        acc[date].onTime++;
      } else {
        acc[date].late++;
      }
      return acc;
    }, {} as Record<string, { date: string; onTime: number; late: number; total: number }>);

    return Object.values(attendanceByDate)
      .filter((item) => item.date && typeof item.date === "string")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => {
        try {
          return {
            ...item,
            dateFormatted: format(parseISO(item.date), "dd MMM", {
              locale: es,
            }),
          };
        } catch {
          return {
            ...item,
            dateFormatted: item.date,
          };
        }
      });
  }, [attendance]);

  const pieData = useMemo(() => {
    if (!attendance || attendance.length === 0) return [];

    const onTime = attendance.filter(
      (att) => att?.status === AttendanceStatus.ON_TIME
    ).length;
    const late = attendance.filter(
      (att) => att?.status === AttendanceStatus.LATE
    ).length;

    const data: { name: string; value: number; color: string }[] = [];
    if (onTime > 0)
      data.push({ name: "A Tiempo", value: onTime, color: COLORS.onTime });
    if (late > 0) data.push({ name: "Tarde", value: late, color: COLORS.late });

    return data;
  }, [attendance]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-800 dark:bg-slate-900 border border-slate-600 dark:border-slate-700 rounded-lg shadow-xl p-3 text-white">
          <p className="font-medium text-slate-100">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === "onTime" ? "A Tiempo" : "Tarde"}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload?.length) {
      const data = payload[0]?.payload as { name: string; value: number };
      return (
        <div className="bg-slate-800 dark:bg-slate-900 border border-slate-600 dark:border-slate-700 rounded-lg shadow-xl p-3 text-white">
          <p className="font-medium text-slate-100">{data.name}</p>
          <p className="text-sm text-slate-300">Cantidad: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Análisis de Asistencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Por Día
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="dateFormatted"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "dataMax + 1"]}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    wrapperStyle={{ outline: "none" }}
                  />
                  <Bar
                    dataKey="onTime"
                    fill={COLORS.onTime}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar
                    dataKey="late"
                    fill={COLORS.late}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={pieData.length > 1 ? 5 : 0}
                    dataKey="value"
                    startAngle={0}
                    endAngle={360}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomPieTooltip />}
                    wrapperStyle={{ outline: "none" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.length > 0 ? (
                pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">{entry.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({entry.value})
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">No hay datos de asistencia</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
