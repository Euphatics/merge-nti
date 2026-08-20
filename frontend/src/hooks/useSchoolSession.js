import { useCallback, useEffect, useState } from 'react';
import { api, onSessionExpired } from '../config/api';

const STORAGE_KEY = 'user';

function readCachedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function cacheUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearCachedUser() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Resolves the signed-in school against the server.
 *
 * The cached copy in localStorage is used only for the first paint. The session
 * itself lives in an HttpOnly cookie that expires long before the cache does, so
 * trusting localStorage alone left the panel rendering a logged-in shell whose
 * every request quietly 401'd.
 *
 * @returns {{ user: object|null, status: 'loading'|'authenticated'|'anonymous', error: Error|null, refresh: () => void, signOut: () => Promise<void> }}
 */
export function useSchoolSession() {
  const [user, setUser] = useState(readCachedUser);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  // The effect performs no synchronous setState: `status` already starts as
  // 'loading', and every update below happens after an await.
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.get('/api/auth/me');
        if (!active) return;
        setUser(data.user);
        cacheUser(data.user);
        setError(null);
        setStatus('authenticated');
      } catch (err) {
        if (!active) return;
        if (err.status === 401 || err.status === 403) {
          clearCachedUser();
          setUser(null);
          setError(null);
          setStatus('anonymous');
        } else {
          // A network or server fault is not proof the session ended; keep the
          // cached user so a transient blip does not sign the coordinator out
          // mid-upload.
          setError(err);
          setStatus(readCachedUser() ? 'authenticated' : 'anonymous');
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [attempt]);

  /** Re-check the session. Called from event handlers. */
  const load = useCallback(() => {
    setStatus('loading');
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(
    () =>
      onSessionExpired((event) => {
        if (event.detail?.scope !== 'school') return;
        clearCachedUser();
        setUser(null);
        setStatus('anonymous');
      }),
    []
  );

  const signOut = useCallback(async () => {
    await api.post('/api/auth/logout').catch(() => undefined);
    clearCachedUser();
    setUser(null);
    setStatus('anonymous');
  }, []);

  return { user, status, error, refresh: load, signOut };
}
