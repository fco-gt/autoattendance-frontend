import { apiClient } from "./apiClient";
import { useAuthStore } from "@/stores/useAuth";
import type {
  AgencyFrontend,
  AuthAgencyResponse,
  UserFrontend,
} from "@/types/FrontendTypes";
import { setCookie } from "./auth";

export async function registerAgency(body: {
  name: string;
  domain: string;
  password: string;
  address?: string;
  phone?: string;
}) {
  const res = await apiClient<AuthAgencyResponse>("/agencies/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  useAuthStore.getState().setSubject({ type: "agency", data: res.agency });

  if (res.token) {
    await setCookie(res.token, "agency");
  }
  return res;
}

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

export async function updateAgency(body: {
  name: string;
  address?: string;
  phone?: string;
}): Promise<AgencyFrontend> {
  const res = await apiClient<AgencyFrontend>(`/agencies`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  useAuthStore.getState().setSubject({ type: "agency", data: res });

  return res;
}

export const fetchAgencyUsers = () =>
  apiClient<UserFrontend[]>("/agencies/me/users", { method: "GET" });

export const deleteAgencyUser = (id: string) =>
  apiClient<UserFrontend>(`/users/${id}`, {
    method: "DELETE",
  });

export const inviteUser = (body: {
  email: string;
  name: string;
  lastname?: string;
}) =>
  apiClient<UserFrontend>("/agencies/invite-user", {
    method: "POST",
    body: JSON.stringify(body),
  });
