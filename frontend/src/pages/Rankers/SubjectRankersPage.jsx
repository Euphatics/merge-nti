
const subjects = [
  { no: 1, name: 'NTI Mathematics Olympiad (NMO)', link: 'NMO' },
  { no: 2, name: 'NTI English Olympiad (NEO)', link: 'NEO' },
  { no: 3, name: 'NTI Science Olympiad (NSO)', link: 'NSO' },
  { no: 4, name: 'NTI Information Technology Olympiad (NITO)', link: 'NITO' },
  { no: 5, name: 'NTI Finance Olympiad (NFO)', link: 'NFO' },
];

import { Helmet } from 'react-helmet-async';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';

export default function SubjectRankersPage({ onSelectSubject }) {
  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <Helmet>
        <title>Subject Rankers – NTI Olympiad Hall of Fame</title>
        <meta name="description" content="Browse top performing students by subject in the NTI Olympiad and explore national rankers." />
        <link rel="canonical" href="https://ntiolympiad.in/subject-rankers" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Subject Rankers – NTI Olympiad Hall of Fame" />
        <meta property="og:description" content="Browse top performing students by subject in the NTI Olympiad and explore national rankers." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content="https://ntiolympiad.in/subject-rankers" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subject Rankers – NTI Olympiad Hall of Fame" />
        <meta name="twitter:description" content="Browse top performing students by subject in the NTI Olympiad and explore national rankers." />
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
                "name": "Subject Rankers",
                "item": "https://ntiolympiad.in/subject-rankers"
              }
            ]
          })}
        </script>
      </Helmet>

      {/* ── Breadcrumb Bar ── */}
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Subject Rankers' }
        ]}
      />

      <PageContainer className="max-w-7xl mx-auto pt-10">
        <SectionHeading level="h2" className="mb-10 border-b border-gray-200 pb-4">
          Subject Rankers
        </SectionHeading>

        <div className="overflow-x-auto border border-gray-200 shadow-sm rounded-t-lg">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#0b5f83] text-white">
                <th className="py-4 px-6 text-base font-semibold border-r border-white/20 w-32">Serial No</th>
                <th className="py-4 px-6 text-base font-semibold border-r border-white/20">Subject Name</th>
                <th className="py-4 px-6 text-base font-semibold w-56">Rankers List</th>
              </tr>
            </thead>
            <tbody className="text-base text-gray-700">
              {subjects.map((subject, index) => (
                <tr 
                  key={subject.no} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'}
                >
                  <td className="py-5 px-6 border-r border-gray-100">{subject.no}</td>
                  <td className="py-5 px-6 border-r border-gray-100 text-gray-800">{subject.name}</td>
                  <td 
                    className="py-5 px-6 text-[#007BFF] hover:underline cursor-pointer font-medium"
                    onClick={() => onSelectSubject && onSelectSubject(subject.name)}
                  >
                    Click Here
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </PageContainer>
    </div>
  );
}
