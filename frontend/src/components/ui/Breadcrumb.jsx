/**
 * Breadcrumb
 * Renders the site-wide blue-tinted breadcrumb bar.
 *
 * Props:
 *   items – Array of { label: string, path?: string }
 *           The last item is always rendered as plain text (current page).
 *           All others are rendered as clickable Links.
 *
 * Example:
 *   <Breadcrumb items={[
 *     { label: 'Home', path: '/' },
 *     { label: 'Syllabus', path: '/syllabus-pyqs' },
 *     { label: 'Mathematics' }
 *   ]} />
 */
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="w-full bg-[#f0f8ff] border-b border-blue-100 py-3 px-6 sm:px-10 lg:px-16">
      <div className="text-[13px] sm:text-[14px] text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={index}>
              {index > 0 && <span className="mx-2">/</span>}
              {isLast || !item.path ? (
                <span className="text-gray-700">{item.label}</span>
              ) : (
                <Link to={item.path} className="text-[#007BFF] hover:underline">
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
