
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';

// Dummy data for rankers
const rankersData = [
  { zone: 'ANDHRA PRADESH ZONE', class: '01', name: 'PODILI SATYA SRAVAN', school: 'SRINIVASA PUBLIC SCHOOL' },
  { zone: 'ANDHRA PRADESH ZONE', class: '02', name: 'RAJOLU VENKATA SRI KEDHAR', school: 'SRINIVASA PUBLIC SCHOOL' },
  { zone: 'ANDHRA PRADESH ZONE', class: '03', name: 'PASUPULETI KOMALI DEVI', school: 'SRINIVASA PUBLIC SCHOOL' },
  { zone: 'ANDHRA PRADESH ZONE', class: '04', name: 'AYAAN AGRAWAL', school: 'LITTLE WOODS SCHOOL' },
  { zone: 'ANDHRA PRADESH ZONE', class: '05', name: 'KAKARLA MANASWINI', school: 'SRINIVASA PUBLIC SCHOOL' },
  { zone: 'DELHI NCR ZONE', class: '06', name: 'ANMOL ANIKET', school: 'DELHI PUBLIC SCHOOL' },
  { zone: 'MAHARASHTRA ZONE', class: '07', name: 'AARAV SHARMA', school: 'BOMBAY SCOTTISH SCHOOL' },
  { zone: 'KARNATAKA ZONE', class: '08', name: 'MEGHANA REDDY', school: 'NATIONAL PUBLIC SCHOOL' },
];

export default function RankersListPage({ subjectName: propSubjectName }) {
  const { subjectName: routeSubjectName } = useParams();
  const subjectName = propSubjectName || decodeURIComponent(routeSubjectName || '');

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <Helmet>
        <title>{`${subjectName} Rankers List – NTI Olympiad`}</title>
        <meta name="description" content={`View the complete list of national rankers and top scorers for NTI ${subjectName} across classes.`} />
        <link rel="canonical" href={`https://ntiolympiad.in/rankers-list/${encodeURIComponent(subjectName)}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${subjectName} Rankers List – NTI Olympiad`} />
        <meta property="og:description" content={`View the complete list of national rankers and top scorers for NTI ${subjectName} across classes.`} />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content={`https://ntiolympiad.in/rankers-list/${encodeURIComponent(subjectName)}`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${subjectName} Rankers List – NTI Olympiad`} />
        <meta name="twitter:description" content={`View the complete list of national rankers and top scorers for NTI ${subjectName} across classes.`} />
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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": `${subjectName} Rankers`,
                "item": `https://ntiolympiad.in/rankers-list/${encodeURIComponent(subjectName)}`
              }
            ]
          })}
        </script>
      </Helmet>
      {/* ── Breadcrumb ── */}
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Subject Rankers', path: '/subject-rankers' },
          { label: `${subjectName} Rankers` }
        ]}
      />

      <PageContainer className="max-w-7xl mx-auto pt-10">
        <SectionHeading level="h2" className="mb-2">
          {subjectName} - Rankers List
        </SectionHeading>
        
        <p className="text-sm text-gray-600 mb-8">
          The following students from various zones have been awarded the NTI Academic Excellence Scholarship for the year 2026-27.
        </p>

        <div className="overflow-x-auto border border-gray-200 shadow-sm rounded-t-lg">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-white border-b-2 border-gray-200">
                <th className="py-4 px-6 text-base font-semibold text-[#0b5f83] border-r border-gray-200 uppercase tracking-wide">Zone</th>
                <th className="py-4 px-6 text-base font-semibold text-[#0b5f83] border-r border-gray-200 uppercase tracking-wide">Class</th>
                <th className="py-4 px-6 text-base font-semibold text-[#0b5f83] border-r border-gray-200 uppercase tracking-wide">Name</th>
                <th className="py-4 px-6 text-base font-semibold text-[#0b5f83] uppercase tracking-wide">School Name</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {rankersData.map((student, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 border-r border-gray-200 text-gray-600">{student.zone}</td>
                  <td className="py-4 px-6 border-r border-gray-200">{student.class}</td>
                  <td className="py-4 px-6 border-r border-gray-200 text-gray-800 font-medium">{student.name}</td>
                  <td className="py-4 px-6 text-gray-600">{student.school}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </PageContainer>
    </div>
  );
}
