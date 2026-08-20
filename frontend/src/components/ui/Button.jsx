/**
 * Button
 * Reusable button component supporting multiple visual variants.
 *
 * Props:
 *   variant   – 'primary' | 'secondary' | 'outline' | 'ghost'  (default: 'primary')
 *   type      – HTML button type (default: 'button')
 *   className – additional Tailwind classes to merge
 *   children  – button label / content
 *   ...rest   – any other native button props (onClick, disabled, id, etc.)
 *
 * Variants (preserve existing codebase classes exactly):
 *   primary   – dark navy bg, white text (used on Contact form submit)
 *   secondary – gray bg, gray text, border (used on syllabus sidebar action buttons)
 *   outline   – transparent bg, blue border and blue text
 *   ghost     – no border/bg, blue text only (used for link-style buttons)
 */
export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const base = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none';

  const variants = {
    primary:
      'px-8 py-2.5 text-sm font-semibold text-white rounded-none active:scale-[0.98] bg-[#1E3A8A] hover:bg-[#172554]',
    secondary:
      'px-4 py-2 border border-gray-300 bg-gray-50 text-[13px] text-gray-700 hover:bg-gray-100 rounded-none',
    outline:
      'px-4 py-2 border border-[#007BFF] text-[#007BFF] text-[13px] bg-transparent hover:bg-blue-50 rounded-none',
    ghost:
      'text-[#00b0ff] text-[15px] hover:text-[#0090e0] bg-transparent p-0',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
