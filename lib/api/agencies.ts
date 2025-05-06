import { apiClient } from "./apiClient";

export const registerAgency = (body: {
  name: string;
  domain: string;
  password: string;
  address: string;
  phone: string;
}) =>
  apiClient("/agencies/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const loginAgency = (body: { domain: string; password: string }) =>
  apiClient("/agencies/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

// Endpoints protegidos con token de agencia:
export const fetchMyAgency = () => apiClient("/agencies/me", { method: "GET" });
export const updateAgency = (
  body: Partial<{ name: string; phone: string; address: string }>
) => apiClient("/agencies/me", { method: "PATCH", body: JSON.stringify(body) });
export const inviteUser = (body: { email: string }) =>
  apiClient("/agencies/invite-user", {
    method: "POST",
    body: JSON.stringify(body),
  });
