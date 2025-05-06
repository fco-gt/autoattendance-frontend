export async function apiClient<T>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${process.env.GATEWAY_URL}/v1/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Error ${res.status}`);
  }
  return (await res.json()) as T;
}
