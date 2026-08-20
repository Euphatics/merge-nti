/**
 * An error with an HTTP status attached.
 *
 * Anything thrown that is *not* an ApiError is treated as an unexpected bug:
 * it is logged in full and reported to the client as a generic 500, so internal
 * details (SQL fragments, file paths, driver messages) never reach the browser.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    if (details !== undefined) this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Authentication required. Please log in.') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You do not have permission to perform this action.') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found.') {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static payloadTooLarge(message = 'The uploaded file is too large.') {
    return new ApiError(413, message);
  }
}
