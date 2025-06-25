"use client";

import { AccountProfileCard } from "./account-profile-card";
import { AccountActivityCard } from "./account-activity-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { type UserFrontend, UserFrontendStatus } from "@/types/FrontendTypes";

interface AccountContentProps {
  user: UserFrontend;
}

export function AccountContent({ user }: AccountContentProps) {
  const getStatusAlert = (status: UserFrontendStatus) => {
    switch (status) {
      case UserFrontendStatus.PENDING:
        return {
          variant: "default" as const,
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "Cuenta Pendiente",
          description:
            "Tu cuenta está pendiente de activación. Contacta al administrador para completar el proceso de verificación.",
        };
      case UserFrontendStatus.INACTIVE:
        return {
          variant: "destructive" as const,
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "Cuenta Inactiva",
          description:
            "Tu cuenta está inactiva. Si crees que esto es un error, contacta al soporte técnico para reactivar tu cuenta.",
        };
      default:
        return null;
    }
  };

  const statusAlert = getStatusAlert(user.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Mi Cuenta</h1>
        <p className="text-muted-foreground">
          Información de tu cuenta de usuario
        </p>
      </div>

      {/* Status Alert */}
      {statusAlert && (
        <Alert variant={statusAlert.variant}>
          {statusAlert.icon}
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">{statusAlert.title}</p>
              <p className="text-sm">{statusAlert.description}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Card */}
      <AccountProfileCard user={user} />

      {/* Activity Card */}
      <AccountActivityCard user={user} />

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Esta información es de solo lectura. Si necesitas actualizar algún
          dato, contacta al administrador del sistema o utiliza la sección de
          configuración correspondiente.
        </AlertDescription>
      </Alert>
    </div>
  );
}
