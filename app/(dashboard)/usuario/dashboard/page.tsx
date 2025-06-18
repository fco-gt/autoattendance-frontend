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
      <div className="flex flex-1 flex-col">
        <div className="p-6 w-full mx-auto">
          <Card className="w-full">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-64" />{" "}
                  <Skeleton className="h-4 w-96 max-w-full" />{" "}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Estado de asistencia Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
                    <Skeleton className="h-5 w-44" />{" "}
                    {/* "Estado de asistencia" */}
                  </div>
                  <Skeleton className="h-7 w-20 rounded-full" />{" "}
                  {/* Status badge */}
                </div>
                <Skeleton className="h-4 w-40" /> {/* "Registro encontrado" */}
              </div>

              {/* Entrada y Salida Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Entrada Section */}
                <div className="space-y-4 p-5 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                    <Skeleton className="h-5 w-20" /> {/* "Entrada" */}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-12" /> {/* "Hora:" */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                        <Skeleton className="h-5 w-16" /> {/* Time "17:54" */}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-24" /> {/* "Programada:" */}
                      <Skeleton className="h-4 w-16" /> {/* "09:00" */}
                    </div>

                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16" /> {/* "Método:" */}
                      <Skeleton className="h-4 w-20" /> {/* "Manual" */}
                    </div>
                  </div>
                </div>

                {/* Salida Section */}
                <div className="space-y-4 p-5 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                    <Skeleton className="h-5 w-16" /> {/* "Salida" */}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-12" /> {/* "Hora:" */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                        <Skeleton className="h-5 w-16" /> {/* Time "17:55" */}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-24" /> {/* "Programada:" */}
                      <Skeleton className="h-4 w-16" /> {/* "17:30" */}
                    </div>

                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16" /> {/* "Método:" */}
                      <Skeleton className="h-4 w-20" /> {/* "Manual" */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas Section */}
              <div className="space-y-3 p-5 rounded-lg border border-border/50 bg-card">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                  <Skeleton className="h-5 w-16" /> {/* "Notas" */}
                </div>
                <Skeleton className="h-4 w-36" /> {/* "Entrada manual" */}
              </div>
            </CardContent>

            {/* Footer Section */}
            <CardFooter className="flex justify-between items-center pt-6 border-t border-border/50">
              <Skeleton className="h-4 w-56" />{" "}
              {/* "Última actualización: 6:49:23 p. m." */}
              <Skeleton className="h-9 w-24 rounded-md" />{" "}
              {/* "Actualizar" button */}
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar estado de error
  if (isError) {
    return (
      <div className="flex flex-1 flex-col p-4 max-w-3xl mx-auto">
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
