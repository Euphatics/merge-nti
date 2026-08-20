import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';
import { SUBJECTS } from '../../config/subjects';

// Dynamically build subject cards from centralized registry config
const ALL_SUBJECTS = SUBJECTS.map((s) => ({
  abbr: s.abbr,
  name: `NTI ${s.name}`,
  slug: s.slug,
  active: true,
  bgClass: 'bg-blue-50/40 border-blue-200 hover:bg-blue-50/80',
  textClass: 'text-blue-800',
  btnClass: 'bg-[#007BFF] hover:bg-[#0069D9] text-white',
}));

export default function PreviousYearPage() {
  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <Helmet>
        <title>Results – NTI Olympiad</title>
        <meta
          name="description"
          content="Access and view official results for NTI Mathematics, Science, English, IT, and Finance Olympiads."
        />
        <link rel="canonical" href="https://ntiolympiad.in/previous-year" />
      </Helmet>

      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Results' },
        ]}
      />

      <PageContainer className="py-8">
        {/* Hero Section */}
        <div className="w-full border-b-2 border-gray-300 pb-5 mb-8 text-left">
          <SectionHeading level="h1" className="font-normal text-gray-900 mb-3">
            NTI Olympiad Results
          </SectionHeading>
          <p className="text-[15px] text-gray-600 leading-relaxed max-w-4xl">
            View the official results and rankings for all NTI Olympiad subjects. 
            Select your subject below to access the performance outcomes for different classes and years.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="mb-12 text-left">
          <h2 className="text-[22px] font-normal text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
            Olympiad Subjects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ALL_SUBJECTS.map((sub) => (
              <div
                key={sub.abbr}
                className={`border-2 border-gray-300 rounded-none p-5 flex flex-col justify-between transition-all duration-200 ${sub.bgClass}`}
              >
                <div>
                  <span className={`text-[12px] font-bold tracking-wider block mb-1.5 ${sub.textClass}`}>
                    {sub.abbr}
                  </span>
                  <h3 className="text-[16px] font-semibold text-gray-900 leading-snug mb-3">
                    {sub.name}
                  </h3>
                </div>
                <div>
                  {sub.active ? (
                    <Link
                      to={ROUTES.subjectPreviousYear(sub.slug)}
                      className={`inline-block w-full text-center py-2 px-3 rounded-none text-[13px] font-semibold transition-colors duration-150 ${sub.btnClass}`}
                    >
                      View Results &rarr;
                    </Link>
                  ) : (
                    <span className="inline-block w-full text-center py-2 px-3 rounded-none text-[13px] font-medium bg-gray-100 text-gray-400 border-2 border-gray-200">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Quick Links Section */}
        <div className="mb-12 text-left max-w-4xl">
          <h2 className="text-[22px] font-normal text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
            Quick Result Links
          </h2>
          <div className="flex flex-col gap-3">
            {ALL_SUBJECTS.filter((s) => s.active).map((sub) => (
              <Link
                key={sub.slug}
                to={ROUTES.subjectPreviousYear(sub.slug)}
                className="text-[14px] text-[#007BFF] hover:underline flex items-center gap-1.5 font-medium"
              >
                &raquo; Results of {sub.name} ({sub.abbr})
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t-2 border-gray-300 pt-8">
          <div>
            <h3 className="text-[17px] font-semibold text-gray-950 mb-3">
              Benefits of Viewing Results
            </h3>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              Viewing past results allows students to benchmark their performance against top achievers and understand the competitive landscape of the NTI Olympiads.
            </p>
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-gray-950 mb-3">
              Result Analysis
            </h3>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              We recommend analyzing the results to set realistic goals for upcoming Olympiads. Consistent performance tracking helps in identifying areas for improvement.
            </p>
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-gray-950 mb-3">
              Official Recognition
            </h3>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              All results published here are official and verified by the NTI Olympiad committee, ensuring complete transparency in our evaluation process.
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
