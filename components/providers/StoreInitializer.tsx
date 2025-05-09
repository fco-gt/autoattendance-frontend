"use client";

import { ReactNode, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuth";
import axios from "axios";

interface MeResponse {
  type: "user" | "agency";
  data: any;
}

export function StoreInitializer({ children }: { children: ReactNode }) {
  const initialized = useRef(false);
  const setSubject = useAuthStore((s) => s.setSubject);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      try {
        const res = await axios.get<MeResponse>("/api/auth/me", {
          withCredentials: true,
        });

        const { type, data } = res.data;
        setSubject({ type, data });
      } catch {
        logout();
      }
    }

    init();
  }, [setSubject, logout]);

  return <>{children}</>;
}
