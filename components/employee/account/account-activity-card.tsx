import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoField } from "./info-field";
import { Calendar, Clock, UserPlus, Activity } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { UserFrontend } from "@/types/FrontendTypes";

interface AccountActivityCardProps {
  user: UserFrontend;
}

export function AccountActivityCard({ user }: AccountActivityCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(
        new Date(dateString),
        "dd 'de' MMMM 'de' yyyy 'a las' HH:mm",
        { locale: es }
      );
    } catch {
      return "Fecha no disponible";
    }
  };

  const formatRelativeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) return "Hoy";
      if (diffInDays === 1) return "Ayer";
      if (diffInDays < 7) return `Hace ${diffInDays} días`;
      if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
      if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
      return `Hace ${Math.floor(diffInDays / 365)} años`;
    } catch {
      return "Fecha no disponible";
    }
  };

  const getAccountAge = () => {
    try {
      const created = new Date(user.createdAt);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays < 30) return `${diffInDays} días`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses`;
      return `${Math.floor(diffInDays / 365)} años`;
    } catch {
      return "No disponible";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-xl">Actividad de la Cuenta</CardTitle>
            <CardDescription>
              Información sobre el historial de tu cuenta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <InfoField
                label="Cuenta creada"
                value={formatDate(user.createdAt)}
                icon={<UserPlus className="h-4 w-4" />}
              />
              <p className="text-xs text-muted-foreground ml-6">
                Antigüedad: {getAccountAge()} (
                {formatRelativeDate(user.createdAt)})
              </p>
            </div>

            <div className="space-y-2">
              <InfoField
                label="Última actualización"
                value={formatDate(user.updatedAt)}
                icon={<Calendar className="h-4 w-4" />}
              />
              <p className="text-xs text-muted-foreground ml-6">
                {formatRelativeDate(user.updatedAt)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Resumen de Actividad
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tiempo en la plataforma:
                  </span>
                  <span className="font-medium">{getAccountAge()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado actual:</span>
                  <span className="font-medium">
                    {user.status === "ACTIVE"
                      ? "Activo"
                      : user.status === "PENDING"
                      ? "Pendiente"
                      : "Inactivo"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Ubicación configurada:
                  </span>
                  <span className="font-medium">
                    {user.homeLatitude && user.homeLongitude ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
