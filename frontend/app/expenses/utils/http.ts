const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function buildUrl(
  path: string,
  params?: URLSearchParams | Record<string, string | number | null | undefined>,
) {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const origin = base || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const url = new URL(path.startsWith("/") ? path : `/${path}`, origin);
  if (params) {
    const search = params instanceof URLSearchParams ? params : new URLSearchParams();
    if (!(params instanceof URLSearchParams)) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          search.set(key, String(value));
        }
      });
    }
    url.search = search.toString();
  }
  return url;
}

export async function getJson<T>(path: string, params?: Record<string, string | number | null | undefined>): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const error = new Error(errorBody.message || `Request failed with ${res.status}`);
    (error as Error & { requestId?: string }).requestId = errorBody.requestId;
    throw error;
  }
  return res.json();
}

export async function postJson<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const error = new Error(errorBody.message || `Request failed with ${res.status}`);
    (error as Error & { details?: unknown }).details = errorBody.errors;
    throw error;
  }
  return res.json();
}
