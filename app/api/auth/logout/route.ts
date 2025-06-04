import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies();
  try {
    if (cookiesStore.get("auth_agency")) {
      cookiesStore.delete("auth_agency");

      return NextResponse.redirect(new URL("/agencia/login", request.url));
    }

    if (cookiesStore.get("auth_user")) {
      cookiesStore.delete("auth_user");

      return NextResponse.redirect(new URL("/usuario/login", request.url));
    }

    return NextResponse.json(
      { message: "No se encontró ninguna sesión" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error al borrar la cookie:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al borrar la cookie" },
      { status: 500 }
    );
  }
}
