import { ApiErrorResponse } from "@/types/api";

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const apiUrl = `/api/proxy${path.startsWith("/") ? path : `/${path}`}`;

  const baseHeaders: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
  };

  const headers: Record<string, string> = { ...baseHeaders };

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  try {
    const res = await fetch(apiUrl, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      let errorData: ApiErrorResponse = {
        message: `Error ${res.status}: ${res.statusText}`,
      };
      try {
        const parsedError = await res.json();
        if (parsedError && typeof parsedError.message === "string") {
          errorData = parsedError as ApiErrorResponse;
        }
      } catch (e) {
        console.warn(
          "No se pudo parsear el cuerpo de la respuesta de error:",
          e
        );
      }
      throw new Error(errorData.message);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return (await res.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error en la solicitud API (${path}):`, error.message);
      throw error;
    } else {
      console.error(`Error desconocido en la solicitud API (${path}):`, error);
      throw new Error("Ocurrió un error de red o API desconocido.");
    }
  }
}
