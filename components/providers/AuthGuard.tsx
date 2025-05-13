"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LoadingScreen } from "@/components/providers/common/loading-screen";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: subject, isLoading, error } = useCurrentUser();
  const setSubject = useAuthStore((s) => s.setSubject);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (subject) {
      setSubject(subject);
    } else if (error) {
      logout();
    }
  }, [subject, error, setSubject, logout]);

  if (isLoading) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  return <>{children}</>;
}
