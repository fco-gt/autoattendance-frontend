import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AgencyFrontend,
  Attendance,
  UserFrontend,
} from "@/types/FrontendTypes";

import {
  formatAttendanceTime,
  formatDate,
  formatTime,
  getMethodText,
  getStatusColor,
  getStatusText,
} from "@/utils/attendance";
import {
  CalendarClock,
  ClipboardCheck,
  Clock,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AttendanceCard({
  attendance,
  refetch,
  user,
}: {
  attendance: Attendance;
  refetch: () => void;
  user: UserFrontend | AgencyFrontend;
}) {
  return (
    <Card className="m-5">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>Bienvenido, {user?.name}</CardTitle>
        </div>
        <CardDescription>
          Información de tu asistencia para hoy, {formatDate(attendance?.date)}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Estado general de la asistencia */}
        <div className="mb-6 p-4 rounded-lg bg-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarClock className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">Estado de asistencia</h3>
                <p className="text-sm text-muted-foreground">
                  {attendance ? "Registro encontrado" : "Sin registro para hoy"}
                </p>
              </div>
            </div>

            {attendance?.status && (
              <Badge
                variant={getStatusColor(attendance.status) as any}
                className="text-sm px-3 py-1"
              >
                {getStatusText(attendance.status)}
              </Badge>
            )}
          </div>
        </div>

        {/* Detalles de la asistencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entrada */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-3">
              <LogIn className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Entrada</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hora:</span>
                <span className="font-medium flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatAttendanceTime(attendance?.checkInTime as string)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Programada:
                </span>
                <span>{formatTime(attendance?.scheduleEntryTime)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Método:</span>
                <span>{getMethodText(attendance?.methodIn)}</span>
              </div>
            </div>
          </div>

          {/* Salida */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-3">
              <LogOut className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Salida</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hora:</span>
                <span className="font-medium flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatAttendanceTime(attendance?.checkOutTime as string)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Programada:
                </span>
                <span>{formatTime(attendance?.scheduleExitTime)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Método:</span>
                <span>{getMethodText(attendance?.methodOut)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        {attendance?.notes && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <div className="flex items-start space-x-2">
              <ClipboardCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Notas</h3>
                <p className="text-sm text-muted-foreground">
                  {attendance.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Actualizar
        </Button>
      </CardFooter>
    </Card>
  );
}
