import { apiClient } from "./apiClient";
import { useAuthStore } from "@/stores/useAuth";
import { setCookie } from "./auth";
import type { AuthUserResponse } from "@/types/FrontendTypes";

export async function loginUser(email: string, password: string) {
  const res = await apiClient<AuthUserResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  useAuthStore.getState().setSubject({ type: "user", data: res.user });

  if (res.token) {
    await setCookie(res.token, "user");
  }

  return res;
}

export async function registerUser(email: string, password: string) {
  const res = await apiClient<AuthUserResponse>("/users/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  useAuthStore.getState().setSubject({ type: "user", data: res.user });

  if (res.token) {
    await setCookie(res.token, "user");
  }

  return res;
}
