// app/api/proxy/[...path]/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  // 1. Leer token de las cookies HttpOnly
  const cookieStore = await cookies();
  const token =
    cookieStore.get("auth_agency")?.value ||
    cookieStore.get("auth_user")?.value;

  // 2. Construir URL de backend incluyendo query string
  const urlObj = new URL(request.url);
  const search = urlObj.search; // ej: "?startDate=2025-05-01&endDate=2025-05-09"
  const apiUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/v1/api/` +
    `${pathSegments.join("/")}${search}`;

  // 3. Preparar encabezados a reenviar
  const headersToForward = new Headers();
  // Copiar solo Content-Type y Accept para no filtrar todo
  ["content-type", "accept"].forEach((name) => {
    const v = request.headers.get(name);
    if (v) headersToForward.set(name, v);
  });
  if (token) {
    headersToForward.set("Authorization", `Bearer ${token}`);
  }

  // 4. Leer cuerpo si no es GET/HEAD
  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }

  try {
    // 5. Hacer fetch al backend
    const apiRes = await fetch(apiUrl, {
      method: request.method,
      headers: headersToForward,
      body,
      // duplex solo si usas streaming; de lo contrario, omítelo
    });

    // 6. Construir respuesta manteniendo headers útiles
    const resHeaders = new Headers(apiRes.headers);
    resHeaders.delete("content-encoding");
    resHeaders.delete("content-length");

    return new NextResponse(apiRes.body, {
      status: apiRes.status,
      statusText: apiRes.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error("[API Proxy] error proxying to", apiUrl, err);
    return NextResponse.json(
      { message: "Error interno del proxy API." },
      { status: 502 }
    );
  }
}

// Métodos HTTP
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
