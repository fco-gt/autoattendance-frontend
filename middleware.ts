// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;

  // Rutas públicas sin validación
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Determina el nombre de cookie según el segmento
  let cookieName: "auth_user" | "auth_agency" | undefined;
  if (pathname.startsWith("/usuario")) {
    cookieName = "auth_user";
  } else if (pathname.startsWith("/agencia")) {
    cookieName = "auth_agency";
  } else {
    // No es ruta protegida
    return NextResponse.next();
  }

  // Recupera el valor de la cookie
  const cookieValue = request.cookies.get(cookieName)?.value;
  if (!cookieValue) {
    // Sin cookie, redirige a login
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Prepara el header de cookies para reenviar al endpoint interno
  const cookieHeader = request.headers.get("cookie") || "";

  // Valida la sesión llamando a tu BFF interno
  const apiRes = await fetch(`${origin}/api/auth/me`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!apiRes.ok) {
    // Sesión inválida: elimina la cookie y redirige
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(cookieName);
    return response;
  }

  // Sesión válida: permitir continuación
  return NextResponse.next();
}

export const config = {
  matcher: ["/usuario/:path*", "/agencia/:path*"],
};
