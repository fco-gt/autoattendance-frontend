import { AuthenticatedSubject } from "@/types/FrontendTypes";
import axios from "axios";

export async function setCookie(token: string, type: "user" | "agency") {
  const res = await axios.post("/api/auth/set-token", {
    token,
    type,
  });

  return res;
}

export async function logout() {
  const res = await axios.post("/api/auth/logout");

  return res;
}

export async function verifyMe(): Promise<AuthenticatedSubject | null> {
  try {
    const res = await axios.get<AuthenticatedSubject>("/api/auth/me", {
      withCredentials: true,
    });

    return res.data;
  } catch (err: unknown) {
    console.log(err);

    return null;
  }
}
