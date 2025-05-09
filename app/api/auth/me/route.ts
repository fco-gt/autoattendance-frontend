import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = request.cookies;
  let token: string | undefined;
  let segment: "users" | "agencies" | undefined;

  if (cookieStore.has("auth_user")) {
    segment = "users";
    token = cookieStore.get("auth_user")?.value;
  } else if (cookieStore.has("auth_agency")) {
    segment = "agencies";
    token = cookieStore.get("auth_agency")?.value;
  }

  if (!segment || !token) {
    return NextResponse.json(
      { message: "No se encontró token de autenticación" },
      { status: 401 }
    );
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/api/${segment}/me`;
  const apiRes = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const payload = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json(
      { message: payload.message || "Error al validar sesión" },
      { status: apiRes.status }
    );
  }

  if (segment === "users") {
    return NextResponse.json({ type: "user", data: payload });
  } else {
    return NextResponse.json({ type: "agency", data: payload });
  }
}
