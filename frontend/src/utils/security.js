/**
 * Security Utility Module for NTI Olympiad
 * Provides client-side binary validation, input sanitization, and session safety.
 */

/**
 * Validates whether a given File object is an authentic PDF by reading its binary magic bytes (%PDF-).
 * Protects against file extension spoofing (e.g. renaming executable/script to .pdf).
 * 
 * @param {File} file - The file selected by the user.
 * @returns {Promise<boolean>} Resolves to true if file starts with %PDF- (0x25 0x50 0x44 0x46 0x2D), false otherwise.
 */
export const validatePDFMagicBytes = (file) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(false);
      return;
    }

    // Read the first 5 bytes of the file
    const reader = new FileReader();
    const blob = file.slice(0, 5);

    reader.onloadend = (e) => {
      if (!e.target || e.target.readyState !== FileReader.DONE) {
        resolve(false);
        return;
      }

      const arr = new Uint8Array(e.target.result);
      // Check magic bytes for '%PDF-' => [0x25, 0x50, 0x44, 0x46, 0x2D]
      const isPdfHeader =
        arr.length >= 5 &&
        arr[0] === 0x25 && // %
        arr[1] === 0x50 && // P
        arr[2] === 0x44 && // D
        arr[3] === 0x46 && // F
        arr[4] === 0x2d;   // -

      resolve(isPdfHeader);
    };

    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(blob);
  });
};

/**
 * Sanitizes input strings intended for search parameters or query strings.
 * Prevents reflective XSS or injection via parameter values.
 * 
 * @param {string} input - The raw input string.
 * @returns {string} Sanitized string.
 */
export const sanitizeQueryParam = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>'"\\]/g, '') // Strip basic HTML/script delimiters
    .substring(0, 150);       // Cap length
};

/**
 * Handles HTTP 401 Unauthorized responses across administrative calls.
 * Clears stored administrative tokens and redirects to the login screen.
 * 
 * @param {Response} response - The fetch Response object.
 * @param {Function} navigate - React Router navigate function.
 * @returns {boolean} True if response was 401 and handled, false otherwise.
 */
export const handleSessionExpiration = (response, navigate) => {
  if (response && response.status === 401) {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminToken');
    if (typeof navigate === 'function') {
      navigate('/admin/login', { replace: true });
    }
    return true;
  }
  return false;
};
