import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';

// Wrapper utilities around `cookies-next` for auth cookie handling.
// Using these wrappers keeps the rest of the app decoupled from the underlying cookie library.
export function getAuthToken(): string | null {
  try {
    const val = getCookie('authToken');
    if (typeof val === 'string') return val;
    // cookies-next may return a string or object depending on usage; coerce
    return val ?? null;
  } catch (err) {
    return null;
  }
}

export function setAuthToken(token: string, options?: { maxAge?: number }) {
  // maxAge in seconds; default to 7 days
  const maxAge = options?.maxAge ?? 7 * 24 * 60 * 60;
  try {
    setCookie('authToken', token, { path: '/', maxAge });
    // Also persist in localStorage for client-side guards
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  } catch (err) {
    // ignore client/server mismatch silently
    // callers should still update client state
  }
}

export function getUserRole(): string | null {
  try {
    const val = getCookie('userRole');
    if (typeof val === 'string') return val;
    return val ?? null;
  } catch (err) {
    return null;
  }
}

export function setUserRole(role: string, options?: { maxAge?: number }) {
  const maxAge = options?.maxAge ?? 7 * 24 * 60 * 60;
  try {
    setCookie('userRole', role, { path: '/', maxAge });
    // Also persist in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
    }
  } catch (err) {
    // ignore
  }
}

export function clearUserRole() {
  try {
    deleteCookie('userRole', { path: '/' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
    }
  } catch (err) {
    // ignore
  }
}

export function clearAuthToken() {
  try {
    deleteCookie('authToken', { path: '/' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  } catch (err) {
    // ignore
  }
}
