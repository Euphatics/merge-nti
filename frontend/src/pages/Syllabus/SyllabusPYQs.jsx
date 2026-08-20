import { SUBJECTS } from '../../config/subjects';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb, PageContainer, Button } from '../../components/ui';

const LogoSVG = ({ abbr }) => (
  <svg width="120" height="60" viewBox="0 0 120 60" className="mx-auto">
    <text x="10" y="40" fontSize="36" fontWeight="bold" fill="#28589c" fontFamily="sans-serif">N</text>
    {/* Simple mountain peak vector */}
    <path d="M 40 40 L 55 20 L 65 30 L 75 15 L 90 40 Z" fill="none" stroke="#28589c" strokeWidth="2" />
    <text x="45" y="38" fontSize="24" fontWeight="normal" fill="#28589c" fontFamily="sans-serif">{abbr.substring(1)}</text>
    <text x="45" y="52" fontSize="10" fontStyle="italic" fill="#28589c" fontFamily="sans-serif">Olympiads</text>
    {/* Curve underneath */}
    <path d="M 10 55 Q 60 65 110 50" fill="none" stroke="#28589c" strokeWidth="2" />
  </svg>
);

export default function SyllabusPYQs({ onSelectSyllabus }) {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>Exam Syllabus and Past Year Papers – NTI Olympiad</title>
        <meta name="description" content="Access the complete syllabus, sample questions, and past papers (PYQs) for all subjects and classes." />
        <link rel="canonical" href="https://ntiolympiad.in/syllabus-pyqs" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Exam Syllabus and Past Year Papers – NTI Olympiad" />
        <meta property="og:description" content="Access the complete syllabus, sample questions, and past papers (PYQs) for all subjects and classes." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content="https://ntiolympiad.in/syllabus-pyqs" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Exam Syllabus and Past Year Papers – NTI Olympiad" />
        <meta name="twitter:description" content="Access the complete syllabus, sample questions, and past papers (PYQs) for all subjects and classes." />
        <meta name="twitter:image" content="https://ntiolympiad.in/about_nti_banner.png" />

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ntiolympiad.in/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Exam Syllabus and PYQs",
                "item": "https://ntiolympiad.in/syllabus-pyqs"
              }
            ]
          })}
        </script>
      </Helmet>
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Exam Syllabus and PYQs' },
      ]} />

      <PageContainer className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* Grid of Subjects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8 text-center mt-10">
            {SUBJECTS.map((subject) => (
              <div
                key={subject.slug}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onSelectSyllabus && onSelectSyllabus(subject.slug)}
              >
                <div className="mb-4 transform transition-transform group-hover:scale-105 duration-300">
                  <LogoSVG abbr={subject.abbr} />
                </div>
                <Button variant="ghost">{subject.label}</Button>
                <p className="text-[12px] text-gray-500 mt-1 font-medium">{subject.name}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
