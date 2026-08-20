import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { onSessionExpired } from '../config/api';

/**
 * Route guard for admin-only pages.
 *
 * The localStorage flag only decides what to render first — the Bearer token is
 * still verified server-side on every request. This listens for the 401 that
 * an expired token produces and redirects, instead of leaving the dashboard
 * sitting on screen with every panel silently failing to load.
 */
export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const [expired, setExpired] = useState(false);

  useEffect(
    () =>
      onSessionExpired((event) => {
        if (event.detail?.scope !== 'admin') return;
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminToken');
        toast.error('Your admin session has expired. Please sign in again.');
        setExpired(true);
      }),
    []
  );

  const isAuthenticated =
    localStorage.getItem('adminAuth') === 'true' && Boolean(localStorage.getItem('adminToken'));

  if (expired || !isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
