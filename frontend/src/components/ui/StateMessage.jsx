import { AlertTriangle, Inbox, RefreshCw, WifiOff } from 'lucide-react';

/**
 * Shared presentation for the non-happy paths of a data-fetching page.
 *
 * Most pages previously swallowed fetch failures into `console.error`, so a
 * network problem and "there is genuinely nothing here" looked identical to
 * the visitor: a blank panel with no way forward.
 */
function StateShell({ icon: Icon, tone, title, description, action }) {
  const tones = {
    error: { ring: 'border-red-100', bg: 'bg-red-50', fg: 'text-red-500' },
    empty: { ring: 'border-gray-100', bg: 'bg-gray-50', fg: 'text-gray-400' },
  };
  const palette = tones[tone] ?? tones.empty;

  return (
    <div
      className={`text-center py-16 px-6 bg-white rounded-xl border ${palette.ring} shadow-sm`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <div
        className={`mx-auto w-14 h-14 rounded-full ${palette.bg} flex items-center justify-center mb-4`}
      >
        <Icon className={`h-7 w-7 ${palette.fg}`} strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {description && (
        <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}

/**
 * Renders a failed request, with a retry button when the caller can retry.
 * Offline and server errors get distinct wording — "check your connection" is
 * unhelpful advice when the connection is fine and the server returned a 500.
 */
export function ErrorState({ error, onRetry, title, className = '' }) {
  const isOffline = error?.status === 0;

  return (
    <div className={className}>
      <StateShell
        icon={isOffline ? WifiOff : AlertTriangle}
        tone="error"
        title={title ?? (isOffline ? "Can't reach the server" : 'Something went wrong')}
        description={
          error?.message ??
          'We were unable to load this content. Please try again in a moment.'
        }
        action={
          onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
            >
              <RefreshCw size={16} strokeWidth={2.5} />
              Try again
            </button>
          )
        }
      />
    </div>
  );
}

/** Renders a successful request that returned nothing. */
export function EmptyState({ title, description, icon = Inbox, action, className = '' }) {
  return (
    <div className={className}>
      <StateShell icon={icon} tone="empty" title={title} description={description} action={action} />
    </div>
  );
}
