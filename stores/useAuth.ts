import { create } from "zustand";
import type {
  AuthenticatedSubject,
} from "@/types/FrontendTypes";

interface AuthState {
  subject: AuthenticatedSubject | null;
  setSubject: (subject: AuthenticatedSubject | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  subject: null,
  setSubject: (subject) => set({ subject }),
  logout: () => set({ subject: null }),
}));

export const useAuthenticatedSubject = () =>
  useAuthStore((state) => state.subject);
