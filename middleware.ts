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
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(cookieName)?.value;
  if (!cookieValue) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const cookieHeader = request.headers.get("cookie") || "";
  
  const apiRes = await fetch(`${origin}/api/auth/me`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!apiRes.ok) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(cookieName);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/usuario/:path*", "/agencia/:path*"],
};
