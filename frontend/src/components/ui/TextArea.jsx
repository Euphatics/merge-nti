/**
 * TextArea
 * Standardized textarea field. Same base styling as Input.
 *
 * Props:
 *   className   – additional Tailwind classes (e.g. "resize-y custom-scroll")
 *   style       – additional inline styles (e.g. { minHeight: '120px' })
 *   rows        – number of visible rows (default: 4)
 *   ...rest     – any native <textarea> props (id, name, placeholder, required, etc.)
 */
export default function TextArea({ className = '', style, rows = 4, ...rest }) {
  const base =
    'w-full px-4 py-2.5 text-sm border rounded-none outline-none transition-all ' +
    'placeholder:text-gray-400 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] ' +
    'bg-gray-50 text-gray-800';

  return (
    <textarea
      rows={rows}
      className={`${base} ${className}`.trim()}
      style={style}
      {...rest}
    />
  );
}
