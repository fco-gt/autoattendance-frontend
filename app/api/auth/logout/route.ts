// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";

export async function POST() {
  const cookiesStore = await cookies();
  try {
    cookiesStore.delete(COOKIE_NAME);

    return NextResponse.json(
      { success: true, message: "Cookie borrada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al borrar la cookie:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al borrar la cookie" },
      { status: 500 }
    );
  }
}
