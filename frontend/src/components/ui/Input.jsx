/**
 * Input
 * Standardized text input field.
 *
 * Props:
 *   className   – additional Tailwind classes
 *   style       – additional inline styles (e.g. { borderColor: '#E5E7EB' })
 *   ...rest     – any native <input> props (id, type, name, placeholder, required, etc.)
 *
 * Preserves the exact inputCls used in ContactUsPage.jsx:
 *   w-full px-4 py-2.5 text-sm border rounded-md outline-none transition-all
 *   placeholder:text-gray-400 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]
 *   bg-gray-50 text-gray-800
 */
export default function Input({ className = '', style, ...rest }) {
  const base =
    'w-full px-4 py-2.5 text-sm border rounded-none outline-none transition-all ' +
    'placeholder:text-gray-400 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] ' +
    'bg-gray-50 text-gray-800';

  return (
    <input
      className={`${base} ${className}`.trim()}
      style={style}
      {...rest}
    />
  );
}
