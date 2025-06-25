"use client";

import { useAuthStore } from "@/stores/useAuth";
import { AccountContent } from "@/components/employee/account/account-content";
import { AccountSkeleton } from "@/components/employee/account/account-skeleton";
import { AccountError } from "@/components/employee/account/account-error";
import type { UserFrontend } from "@/types/FrontendTypes";

export default function CuentaPage() {
  const { subject } = useAuthStore();

  const user = subject?.type === "user" ? (subject.data as UserFrontend) : null;

  const handleRetry = () => {
    // Aquí podrías implementar lógica para recargar los datos del usuario
    // Por ejemplo, llamar a una función del store para refrescar la información
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <AccountSkeleton />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <AccountError
          error="No se encontró información de autenticación"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (subject.type !== "user") {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <AccountError
          error="Esta sección es solo para usuarios. Parece que estás autenticado como agencia."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <AccountError
          error="No se encontraron datos del usuario"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <AccountContent user={user} />
    </div>
  );
}
