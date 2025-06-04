import { create } from "zustand";
import type { AuthenticatedSubject } from "@/types/FrontendTypes";
import { logout } from "@/lib/api/auth";

interface AuthState {
  subject: AuthenticatedSubject | null;
  isLoading: boolean;
  setSubject: (subject: AuthenticatedSubject | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  subject: null,
  isLoading: true,
  setSubject: (subject) => set({ subject }),
  logout: async () => {
    const res = await logout();

    if (res.status === 200) {
      set({ subject: null });
    }
  },
}));

export const useAuthenticatedSubject = () =>
  useAuthStore((state) => state.subject);
