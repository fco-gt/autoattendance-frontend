import { create } from "zustand";
import type { UserFrontend, AgencyFrontend } from "@/types/FrontendTypes";

type AuthenticatedSubject =
  | { type: "user"; data: UserFrontend }
  | { type: "agency"; data: AgencyFrontend };

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
