let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
}

export async function apiClient(path, options = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const {
    method = 'GET',
    headers = {},
    body,
    auth = true,
    token,
  } = options;

  const finalHeaders = new Headers(headers);
  finalHeaders.set('Accept', 'application/json');
  if (!(body instanceof FormData)) {
    finalHeaders.set('Content-Type', 'application/json');
  }
  if (auth) {
    const bearer = token || localStorage.getItem('token');
    if (bearer) finalHeaders.set('Authorization', `Bearer ${bearer}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const text = await response.text();
  const data = text ? safeJson(text) : undefined;

  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}


