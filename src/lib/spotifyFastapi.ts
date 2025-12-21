type ExpiredTokenErrorShape = {
  detail?: {
    error?: {
      status?: number;
      message?: string;
    };
  };
};

function isExpiredTokenError(
  payload: unknown
): payload is ExpiredTokenErrorShape {
  if (!payload || typeof payload !== "object") return false;
  const detail = (payload as ExpiredTokenErrorShape).detail;
  const message = detail?.error?.message;
  const status = detail?.error?.status;
  return status === 401 && message === "The access token expired";
}

async function refreshSpotifyAccessToken() {
  const res = await fetch("/api/spotify/refresh", { method: "POST" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to refresh token (${res.status}): ${text}`);
  }
  return (await res.json()) as { access_token: string; expires_in?: number };
}

type SpotifyFastapiCallOptions<
  TPayload extends Record<string, unknown> | undefined
> = {
  /**
   * Full URL or path. If you pass a path like `/spotify/top-tracks`, it will be
   * appended to `baseUrl`.
   */
  url: string;
  baseUrl?: string;
  accessToken: string;
  payload?: TPayload;
  signal?: AbortSignal;
};

/**
 * Wraps calls to your FastAPI Spotify backend:
 * - sends `{ access_token, ...payload }`
 * - if it receives the expired-token 401 shape, it refreshes + persists token via `/api/spotify/refresh`
 * - retries the original request once with the new token
 */
export async function callSpotifyFastapi<
  TResponse,
  TPayload extends Record<string, unknown> | undefined
>(
  opts: SpotifyFastapiCallOptions<TPayload>
): Promise<{ data: TResponse; accessToken: string }> {
  const baseUrl = opts.baseUrl ?? "http://localhost:8000/api/v1";
  const url = opts.url.startsWith("http") ? opts.url : `${baseUrl}${opts.url}`;

  async function attempt(token: string) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token, ...(opts.payload ?? {}) }),
      signal: opts.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    return { res, body };
  }

  // First attempt
  const first = await attempt(opts.accessToken);
  if (first.res.ok) {
    return { data: first.body as TResponse, accessToken: opts.accessToken };
  }

  // Expired token -> refresh + retry once
  if (first.res.status === 401 && isExpiredTokenError(first.body)) {
    const refreshed = await refreshSpotifyAccessToken();
    const second = await attempt(refreshed.access_token);
    if (!second.res.ok) {
      throw new Error(
        `FastAPI call failed after refresh (${second.res.status}): ${
          typeof second.body === "string"
            ? second.body
            : JSON.stringify(second.body)
        }`
      );
    }
    return {
      data: second.body as TResponse,
      accessToken: refreshed.access_token,
    };
  }

  // Other errors
  throw new Error(
    `FastAPI call failed (${first.res.status}): ${
      typeof first.body === "string" ? first.body : JSON.stringify(first.body)
    }`
  );
}
