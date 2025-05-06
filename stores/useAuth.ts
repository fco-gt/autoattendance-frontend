import { create } from "zustand";
import { AuthState } from "@/types/User";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token: token, user: user }),
  logout: () => set({ token: null, user: null }),
}));
