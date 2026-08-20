import { Navigate } from 'react-router-dom';

/**
 * Route guard for admin-only pages.
 * Checks localStorage for admin authentication.
 * Redirects to /admin/login if not authenticated.
 */
export default function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  const hasToken = !!localStorage.getItem('adminToken');

  if (!isAdmin || !hasToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
