/**
 * PageContainer
 * Encapsulates the site-wide responsive horizontal padding.
 *
 * Props:
 *   className  – additional Tailwind classes (e.g. "py-8", "max-w-7xl mx-auto")
 *   children   – page content
 */
export default function PageContainer({ className = '', children }) {
  return (
    <div className={`w-full px-6 sm:px-10 lg:px-16 ${className}`.trim()}>
      {children}
    </div>
  );
}
