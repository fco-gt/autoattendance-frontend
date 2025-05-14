/**
 * Posibles estados de un usuario.
 */
export enum UserFrontendStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/**
 * Datos públicos de un Usuario recibidos por el frontend.
 */
export interface UserFrontend {
  id: string;
  email: string;
  name: string;
  lastname?: string | null;
  status: UserFrontendStatus;
  agencyId?: string | null;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * Datos públicos de una Agencia recibidos por el frontend.
 */
export interface AgencyFrontend {
  id: string;
  name: string;
  domain: string;
  address?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * Respuesta de validacion /me
 */

export type AuthenticatedSubject =
  | { type: "user"; data: UserFrontend }
  | { type: "agency"; data: AgencyFrontend };

/**
 * Respuesta de autenticación con token y datos de usuario.
 */
export interface AuthUserResponse {
  user: UserFrontend;
  token: string;
  message?: string;
}

/**
 * Respuesta de autenticación/registro con token y datos de agencia.
 */
export interface AuthAgencyResponse {
  agency: AgencyFrontend;
  token: string;
  message?: string;
}

/**
 * Respuesta de error estándar de la API.
 */
export interface ApiErrorResponse {
  message: string;
  details?: { path: string; message: string }[];
}

/**
 * Horarios
 */
export interface Schedule {
  id: string;
  agencyId: string;
  name: string;
  daysOfWeek: number[]; // 0=Sunday, 1=Monday, etc.
  entryTime: string; // HH:MM
  exitTime: string; // HH:MM
  gracePeriodMinutes: number;
  isDefault: boolean;
  assignedUsersIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Asistencia
 */
export interface Attendance {
  id: string;
  userId: string;
  agencyId: string;
  checkInTime: string; // HH:MM
  scheduleEntryTime: string; // HH:MM
  status: AttendanceStatus;
  checkOutTime: string; // HH:MM
  scheduleExitTime: string; // HH:MM
  date: string; // YYYY-MM-DD
  methodIn: AttendanceMethod;
  methodOut: AttendanceMethod;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export enum AttendanceStatus {
  ON_TIME = "ON_TIME",
  LATE = "LATE",
}

export enum AttendanceMethod {
  MANUAL = "MANUAL",
  QR = "QR",
  NFC = "NFC",
}

export type CreateSchedulePayload = Omit<
  Schedule,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateSchedulePayload = Partial<
  Omit<Schedule, "id" | "agencyId" | "createdAt" | "updatedAt">
>;

export type variants =
  | "destructive"
  | "outline"
  | "default"
  | "secondary"
  | null
  | undefined;
