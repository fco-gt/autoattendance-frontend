import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookiesStore = await cookies();
  try {
    if (cookiesStore.get("auth_agency")) {
      cookiesStore.delete("auth_agency");

      return NextResponse.json(
        { message: "Sesión de agencia cerrada." },
        { status: 200 }
      );
    }

    if (cookiesStore.get("auth_user")) {
      cookiesStore.delete("auth_user");

      return NextResponse.json(
        { message: "Sesión de usuario cerrada." },
        { status: 200 }
      );
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
