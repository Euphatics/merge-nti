/**
 * "Coming Soon" placeholder for unpublished syllabus pages.
 * Renders noindex to prevent Google from indexing thin content.
 */

import { Link } from 'react-router-dom';
import PageHelmet from '../../seo/PageHelmet';
import { buildPageMeta } from '../../seo/meta';
import { buildBreadcrumbSchema } from '../../seo/schemaBuilders';
import { ROUTES } from '../../config/routes';

export default function UnpublishedPage({ subjectName, className, subjectSlug }) {
  const title = `${subjectName} Olympiad for ${className}`;

  const meta = buildPageMeta({
    title: `${title} – NTI Olympiad`,
    description: `The NTI ${subjectName} ${className} Olympiad syllabus is currently being prepared.`,
    path: ROUTES.syllabusClass(subjectSlug, className.toLowerCase().replace(/\s+/g, '-')),
    noindex: true,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Exam Syllabus and PYQs', path: '/syllabus-pyqs' },
    { name: `${subjectName} Syllabus`, path: ROUTES.syllabusDetail(subjectSlug) },
    { name: className },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <PageHelmet meta={meta} schemas={[breadcrumbSchema]} />

      {/* Breadcrumb Bar */}
      <div className="w-full bg-[#f0f8ff] border-b border-blue-100 py-3 px-6 sm:px-10 lg:px-16">
        <div className="text-[13px] sm:text-[14px] text-gray-500">
          <Link to="/" className="text-[#007BFF] hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/syllabus-pyqs" className="text-[#007BFF] hover:underline">Exam Syllabus and PYQs</Link>
          <span className="mx-2">/</span>
          <Link to={ROUTES.syllabusDetail(subjectSlug)} className="text-[#007BFF] hover:underline">
            {subjectName} Syllabus
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{className}</span>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-16 flex flex-col items-center text-center">
        <div className="max-w-lg">
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#28589c]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>

          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-3">
            {subjectName} Olympiad for <strong className="font-bold">{className}</strong>
          </h1>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
            This syllabus is currently being prepared and will be published soon.
            Check back regularly for updates, or explore other available syllabi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={ROUTES.syllabusDetail(subjectSlug)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#28589c] text-white text-[14px] font-medium hover:bg-[#1e4578] transition-colors"
            >
              View {subjectName} Overview
            </Link>
            <Link
              to="/syllabus-pyqs"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors"
            >
              Browse All Subjects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
