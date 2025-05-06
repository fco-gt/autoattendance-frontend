/**
 * Define los posibles estados de un usuario que el frontend puede recibir.
 */
export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/**
 * Representa la estructura de datos de un Usuario tal como la recibe el frontend
 * desde la API (ej: endpoints /me, /activate-invitation).
 * Excluye campos sensibles como la contraseña.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  lastname?: string | null;
  status: UserStatus;
  agencyId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tipo opcional para representar la respuesta del login/activación
 * que incluye el token junto con los datos del usuario.
 */
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

/**
 * Tipo para representar el estado de autenticación del usuario.
 * Incluye el token y el usuario si está autenticado.
 */
export interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}
