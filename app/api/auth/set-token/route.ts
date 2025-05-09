import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies();

  try {
    const body = await request.json();
    const token = body.token;
    const cookieType: "user" | "agency" = body.type;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Token no proporcionado o inválido" },
        { status: 400 }
      );
    }

    if (!cookieType || typeof cookieType !== "string") {
      return NextResponse.json(
        { message: "Tipo de cookie no proporcionado o inválido" },
        { status: 400 }
      );
    }

    cookiesStore.set({
      name: cookieType === "user" ? "auth_user" : "auth_agency",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(
      { success: true, message: "Cookie establecida" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al establecer la cookie:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al establecer la cookie" },
      { status: 500 }
    );
  }
}
