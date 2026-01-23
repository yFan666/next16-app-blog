type RequestJsonOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

export type ApiResponse<T> =
  | { code: 0; message: string; data: T }
  | { code: number; message: string; data: null };

export class ApiError extends Error {
  status: number;
  code?: number;

  constructor(input: { message: string; status: number; code?: number }) {
    super(input.message);
    this.status = input.status;
    this.code = input.code;
  }
}

function buildUrl(path: string, query?: RequestJsonOptions["query"]): string {
  const url = new URL(path, "http://localhost");
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.pathname + url.search;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object";
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (!isObject(value)) return false;
  if (!("code" in value) || !("message" in value) || !("data" in value)) {
    return false;
  }
  return typeof value.code === "number" && typeof value.message === "string";
}

export async function requestJson<T>(
  path: string,
  options?: RequestJsonOptions,
): Promise<T> {
  const url = buildUrl(path, options?.query);

  const res = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      ...(options?.body != null ? { "Content-Type": "application/json" } : {}),
      ...(options?.headers ?? {}),
    },
    body: options?.body != null ? JSON.stringify(options.body) : undefined,
    cache: options?.cache,
  });

  let json: unknown = null;
  try {
    json = (await res.json()) as unknown;
  } catch {}

  if (isApiResponse(json)) {
    if (res.ok && json.code === 0) {
      return json.data as T;
    }

    throw new ApiError({
      status: res.status,
      code: json.code,
      message: json.message || `Request failed: ${res.status}`,
    });
  }

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    if (isObject(json)) {
      const legacyError = json.error;
      const legacyMessage = json.message;
      if (typeof legacyError === "string" && legacyError.trim()) {
        message = legacyError;
      } else if (typeof legacyMessage === "string" && legacyMessage.trim()) {
        message = legacyMessage;
      }
    }
    throw new ApiError({ status: res.status, message });
  }

  return json as T;
}
