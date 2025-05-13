"use client";

import { useAuthStore } from "@/stores/useAuth";
import { useUserAttendanceToday } from "@/hooks/useAttendance";
import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AttendanceCard from "@/components/employee/attendance-card";

export default function AttendancePage() {
  const subject = useAuthStore((s) => s.subject);
  const user = subject?.data;

  const {
    data: attendance,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserAttendanceToday();

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar estado de error
  if (isError) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Error al cargar la asistencia</CardTitle>
            </div>
            <CardDescription>
              No pudimos obtener la información de tu asistencia para hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
              {error?.message || "Ha ocurrido un error inesperado"}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="w-full"
            >
              Intentar nuevamente
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {attendance && user && (
        <AttendanceCard attendance={attendance} refetch={refetch} user={user} />
      )}
    </div>
  );
}
