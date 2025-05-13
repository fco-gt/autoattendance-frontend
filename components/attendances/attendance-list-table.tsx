import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Clock } from "lucide-react";
import type { Attendance } from "@/types/FrontendTypes";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  formatAttendanceTime,
  formatTime,
  getMethodText,
  getStatusBadgeVariant,
} from "@/utils/attendance";

interface AttendanceTableProps {
  attendances: Attendance[];
  getUserName: (userId: string) => string;
}

type variants = "destructive" | "outline" | "default" | "secondary";

export function AttendanceTable({
  attendances,
  getUserName,
}: AttendanceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Entrada</TableHead>
          <TableHead>Salida</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Notas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances.map((attendance) => (
          <TableRow key={attendance.id}>
            <TableCell>
              {format(parseISO(attendance.date), "dd MMM yyyy", { locale: es })}
            </TableCell>
            <TableCell className="font-medium">
              {getUserName(attendance.userId)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatAttendanceTime(attendance.checkInTime)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Programada: {formatTime(attendance.scheduleEntryTime)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatAttendanceTime(attendance.checkOutTime)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Programada: {formatTime(attendance.scheduleExitTime)}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={getStatusBadgeVariant(attendance.status) as variants}
              >
                {attendance.status === "ON_TIME" ? "A tiempo" : "Tarde"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="text-xs">
                  Entrada: {getMethodText(attendance.methodIn)}
                </span>
                <span className="text-xs">
                  Salida: {getMethodText(attendance.methodOut)}
                </span>
              </div>
            </TableCell>
            <TableCell
              className="max-w-[200px] truncate"
              title={attendance.notes}
            >
              {attendance.notes || "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
