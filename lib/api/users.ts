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

export const activateUser = (activationCode: string, password: string) =>
  apiClient<AuthUserResponse>("/users/activate", {
    method: "POST",
    body: JSON.stringify({ token: activationCode, password }),
  });

export const validateActivationToken = (activationCode: string) =>
  apiClient<{ message: string; isValid?: boolean }>("/users/validate-token", {
    method: "POST",
    body: JSON.stringify({ token: activationCode }),
  });
