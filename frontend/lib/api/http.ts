import { buildApiUrl, getServerEnv } from '@/config/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  searchParams?: URLSearchParams | Record<string, unknown>;
  headers?: HeadersInit;
  body?: BodyInit | null;
  timeoutMs?: number;
  signal?: AbortSignal;
};

const DEFAULT_TIMEOUT_MS = 10_000;

function ensureServerOnly() {
  if (typeof window !== 'undefined') {
    throw new Error('The hardened HTTP client can only be used on the server');
  }
}

function createAbortController(timeoutMs: number, externalSignal?: AbortSignal) {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  return {
    signal: controller.signal,
    dispose: () => clearTimeout(timeout),
  };
}

export async function requestChapter5<T>(path: string, options: RequestOptions = {}): Promise<T> {
  ensureServerOnly();

  const { method = 'GET', headers = {}, body, timeoutMs = DEFAULT_TIMEOUT_MS, searchParams, signal } = options;
  const url = buildApiUrl(path, searchParams);
  const { NEXT_SERVICE_TOKEN } = getServerEnv();

  const headerBag = new Headers(headers);
  headerBag.set('Authorization', `Bearer ${NEXT_SERVICE_TOKEN}`);
  if (body && typeof body === 'string' && !headerBag.has('Content-Type')) {
    headerBag.set('Content-Type', 'application/json');
  }

  const { signal: controllerSignal, dispose } = createAbortController(timeoutMs, signal);

  try {
    const response = await fetch(url, {
      method,
      headers: headerBag,
      body,
      signal: controllerSignal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || `Upstream request failed with ${response.status}`);
      (error as Error & { code?: string }).code = errorBody.code;
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request to ${url.pathname} timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    dispose();
  }
}

export async function requestChapter5Json<T>(path: string, options: RequestOptions = {}) {
  const body = options.body && typeof options.body === 'object' && !(options.body instanceof Blob)
    ? JSON.stringify(options.body)
    : options.body;

  return requestChapter5<T>(path, { ...options, body });
}
