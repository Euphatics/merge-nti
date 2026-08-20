/**
 * Central API configuration and fetch helpers.
 *
 * The base URL comes from VITE_API_URL so the same source tree can be built for
 * local, staging and production. It was previously hardcoded per build mode,
 * which meant repointing the frontend required editing this file.
 */

function resolveBaseUrl() {
  const configured = import.meta.env.VITE_API_URL;

  if (configured) return configured.replace(/\/$/, '');

  if (import.meta.env.DEV) return 'http://localhost:5000';

  // A production bundle with no API URL cannot talk to anything. Fail loudly at
  // load time rather than emitting confusing relative-URL 404s on every page.
  console.error(
    '[api] VITE_API_URL is not set. Define it in .env.production before running `npm run build`.'
  );
  return '';
}

export const API_BASE_URL = resolveBaseUrl();

/** Builds an absolute API URL from a path such as `/api/gallery`. */
export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// ── Session handling ──────────────────────────────────────────

const SESSION_EXPIRED_EVENT = 'nti:session-expired';

/**
 * Broadcasts an expired session so the app can clear its cached user and
 * redirect once, instead of every page independently rendering an empty state.
 */
function notifySessionExpired(scope) {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT, { detail: { scope } }));
}

export function onSessionExpired(handler) {
  window.addEventListener(SESSION_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
}

/** Thrown by `api*` helpers when the server responds with a non-2xx status. */
export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Reads the error message out of a response.
 * The API returns `{ error }` and, for validation failures, a `details` array.
 */
async function toApiError(response) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // Non-JSON body (a proxy error page, for instance).
  }

  if (payload?.details?.length) {
    const first = payload.details[0];
    return new ApiError(first.message ?? payload.error ?? 'Request failed', {
      status: response.status,
      details: payload.details,
    });
  }

  const fallback =
    response.status >= 500
      ? 'The server ran into a problem. Please try again in a moment.'
      : 'Something went wrong. Please try again.';

  return new ApiError(payload?.error ?? fallback, { status: response.status });
}

function buildHeaders(options, { admin }) {
  const headers = { ...(options.headers ?? {}) };

  // Never set Content-Type on FormData — the browser must add the multipart boundary.
  if (options.body !== undefined && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (admin) {
    const token = localStorage.getItem('adminToken');
    if (token && !headers['Authorization']) headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Core request helper: resolves to parsed JSON, throws `ApiError` otherwise.
 *
 * A 401 also emits a session-expired event, which is what stops the school
 * panel from sitting there looking logged in after the cookie has lapsed.
 */
async function request(path, options = {}, { admin = false } = {}) {
  const { body, ...rest } = options;

  let response;
  try {
    response = await fetch(apiUrl(path), {
      ...rest,
      credentials: 'include',
      headers: buildHeaders(options, { admin }),
      body: body instanceof FormData || typeof body === 'string' ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    throw new ApiError(
      'Could not reach the server. Check your internet connection and try again.',
      { status: 0, details: cause }
    );
  }

  if (response.status === 401) {
    notifySessionExpired(admin ? 'admin' : 'school');
  }

  if (!response.ok) throw await toApiError(response);

  if (response.status === 204) return null;

  return response.json().catch(() => null);
}

/** Public/school request. Sends the session cookie. */
export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

/** Admin request. Adds the Bearer token from localStorage. */
export const adminApi = {
  get: (path, options) => request(path, { ...options, method: 'GET' }, { admin: true }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }, { admin: true }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }, { admin: true }),
  patch: (path, body, options) =>
    request(path, { ...options, method: 'PATCH', body }, { admin: true }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }, { admin: true }),
};

// ── Backwards-compatible helpers ──────────────────────────────
// Retained so existing call sites keep working while pages migrate to `api`.

/** Default options for a credentialed JSON request. */
export const fetchOptions = (method = 'GET', body = null) => ({
  method,
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

/** Raw fetch that attaches the admin Bearer token and cookie credentials. */
export const secureFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: buildHeaders(options, { admin: true }),
  });

  if (response.status === 401) notifySessionExpired('admin');

  return response;
};
