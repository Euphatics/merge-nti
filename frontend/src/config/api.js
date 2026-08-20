/**
 * Centralized API configuration and secure fetch wrapper for NTI Olympiad.
 */
export const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000' 
  : 'https://olympiad-backend-yzd4.onrender.com';

/**
 * Default fetch options for standard API calls.
 */
export const fetchOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta && csrfMeta.content) {
    options.headers['X-CSRF-Token'] = csrfMeta.content;
  } else {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    if (match) {
      options.headers['X-XSRF-TOKEN'] = match[1];
    }
  }

  if (body) {
    options.body = JSON.stringify(body);
  }
  return options;
};

/**
 * Secure fetch wrapper for administrative and protected API calls.
 * Automatically injects Bearer JWT headers, HttpOnly cookie credentials, and CSRF headers.
 * 
 * @param {string} url - Target URL.
 * @param {Object} options - Fetch options.
 * @returns {Promise<Response>}
 */
export const secureFetch = (url, options = {}) => {
  const adminToken = localStorage.getItem('adminToken') || '';
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (adminToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta && csrfMeta.content) {
    headers['X-CSRF-Token'] = csrfMeta.content;
  } else {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    if (match) {
      headers['X-XSRF-TOKEN'] = match[1];
    }
  }

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });
};
