import { AttendanceMethod, AttendanceStatus } from "@/types/FrontendTypes";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// Función para formatear la hora
export const formatTime = (time: string) => {
  if (!time) return "—";
  return time;
};

// Función para obtener el color del badge según el estado
export const getStatusBadgeVariant = (status: AttendanceStatus) => {
  switch (status) {
    case "ON_TIME":
      return "success";
    case "LATE":
      return "destructive";
    default:
      return "secondary";
  }
};

// Función para obtener el texto del método de asistencia
export const getMethodText = (method: AttendanceMethod) => {
  switch (method) {
    case "MANUAL":
      return "Manual";
    case "QR":
      return "Código QR";
    case "NFC":
      return "NFC";
    default:
      return method;
  }
};

// Función para formatear la hora de asistencia (Formato que entra: 2025-05-09T20:40)
export const formatAttendanceTime = (time: string) => {
  if (!time) return "—";

  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes}`;
};

// Función para formatear la fecha
export const formatDate = (dateString?: string) => {
  if (!dateString) return "No disponible";
  try {
    return format(parseISO(dateString), "EEEE, d 'de' MMMM 'de' yyyy", {
      locale: es,
    });
  } catch (e) {
    return dateString;
  }
};

// Función para obtener el texto del estado
export const getStatusText = (status?: AttendanceStatus) => {
  switch (status) {
    case "ON_TIME":
      return "A tiempo";
    case "LATE":
      return "Tarde";
    default:
      return "No disponible";
  }
};

// Función para obtener el color del estado
export const getStatusColor = (status?: AttendanceStatus) => {
  switch (status) {
    case "ON_TIME":
      return "success";
    case "LATE":
      return "destructive";
    default:
      return "secondary";
  }
};
