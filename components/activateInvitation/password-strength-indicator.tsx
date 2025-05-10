"use client";

import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    // Longitud
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complejidad
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Normalizar a un valor entre 0 y 4
    return Math.min(4, Math.floor(score / 1.5));
  }, [password]);

  const getStrengthText = () => {
    if (!password) return "Ingresa tu contraseña";

    switch (strength) {
      case 0:
        return "Muy débil";
      case 1:
        return "Débil";
      case 2:
        return "Moderada";
      case 3:
        return "Fuerte";
      case 4:
        return "Muy fuerte";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    if (!password) return "bg-muted";

    switch (strength) {
      case 0:
        return "bg-destructive";
      case 1:
        return "bg-destructive/80";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500/80";
      case 4:
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {password && (
          <>
            <div
              className={`h-full ${getStrengthColor()}`}
              style={{ width: `${(strength / 4) * 100}%` }}
            />
          </>
        )}
      </div>
      <div className="text-xs text-muted-foreground">{getStrengthText()}</div>
    </div>
  );
}
