type RequestJsonOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

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

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const json = (await res.json()) as { error?: unknown; message?: unknown };
      if (typeof json.error === "string" && json.error.trim()) {
        message = json.error;
      } else if (typeof json.message === "string" && json.message.trim()) {
        message = json.message;
      }
    } catch {}
    throw new Error(message);
  }

  return (await res.json()) as T;
}
