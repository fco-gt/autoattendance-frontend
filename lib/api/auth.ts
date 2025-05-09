import axios from "axios";

export async function setCookie(token: string, type: "user" | "agency") {
  const res = await axios.post("/api/auth/set-token", {
    token,
    type,
  });

  return res;
}
