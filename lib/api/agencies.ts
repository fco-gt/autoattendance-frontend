import { apiClient } from "./apiClient";
import { useAuthStore } from "@/stores/useAuth";
import type { AuthAgencyResponse, UserFrontend } from "@/types/FrontendTypes";
import { setCookie } from "./auth";

export const registerAgency = (body: {
  name: string;
  domain: string;
  password: string;
  address?: string;
  phone?: string;
}): Promise<AuthAgencyResponse> =>
  apiClient<AuthAgencyResponse>("/agencies/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

export async function loginAgency(domain: string, password: string) {
  const res = await apiClient<AuthAgencyResponse>("/agencies/login", {
    method: "POST",
    body: JSON.stringify({ domain, password }),
  });
  useAuthStore.getState().setSubject({ type: "agency", data: res.agency });

  if (res.token) {
    await setCookie(res.token, "agency");
  }
  return res;
}

export const fetchAgencyUsers = () =>
  apiClient<UserFrontend[]>("/agencies/me/users", { method: "GET" });

export const inviteUser = (body: {
  email: string;
  name: string;
  lastname?: string;
}) =>
  apiClient<UserFrontend>("/agencies/invite-user", {
    method: "POST",
    body: JSON.stringify(body),
  });
