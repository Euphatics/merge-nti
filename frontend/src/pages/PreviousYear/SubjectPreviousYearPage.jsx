import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { getSubjectBySlug, CLASS_LEVELS } from '../../config/subjects';
import { ROUTES } from '../../config/routes';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';
import { API_BASE_URL } from '../../config/api';

export default function SubjectPreviousYearPage() {
  const { subjectSlug } = useParams();
  const subject = getSubjectBySlug(subjectSlug);
  const [activeClass, setActiveClass] = useState(CLASS_LEVELS[0].slug);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch results from backend
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/results`);
        if (res.ok) {
          const data = await res.json();
          // Filter results for this specific subject
          const subjectResults = data.results.filter(r => r.subjectSlug === subjectSlug);
          setResults(subjectResults);
        }
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };
    if (subject) fetchResults();
  }, [subject, subjectSlug]);

  // Scrollspy observer logic for highlighting active sidebar class item on scroll
  useEffect(() => {
    if (!subject) return;

    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    };

    const sectionElements = CLASS_LEVELS.map(cls => 
      document.getElementById(cls.slug)
    ).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveClass(entry.target.id);
        }
      });
    }, observerOptions);

    sectionElements.forEach(el => observer.observe(el));

    // Bottom-of-page detector to make sure the last class is highlighted when scrolled to the end
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveClass(CLASS_LEVELS[CLASS_LEVELS.length - 1].slug);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      sectionElements.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, [subject]);

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-left">
        <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-none max-w-sm shadow-sm">
          <h1 className="text-xl font-medium text-gray-800 mb-2">Subject Not Found</h1>
          <p className="text-gray-500 text-sm mb-4">The results for this subject could not be located.</p>
          <Link to={ROUTES.previousYear} className="px-6 py-2 bg-[#007BFF] text-white rounded-md hover:bg-blue-600 transition-colors inline-block text-sm font-medium">
            Go back to all subjects
          </Link>
        </div>
      </div>
    );
  }

  const scrollToSection = (slug) => {
    setActiveClass(slug);
    const element = document.getElementById(slug);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-left">
      <Helmet>
        <title>{`NTI ${subject.abbr} Results – Class 1 to 10`}</title>
        <meta name="description" content={`View NTI ${subject.name} (${subject.abbr}) results for classes 1 to 10.`} />
        <link rel="canonical" href={`https://ntiolympiad.in/previous-year/${subject.slug}`} />
      </Helmet>

      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Results', path: ROUTES.previousYear },
        { label: `${subject.abbr} Results` }
      ]} />

      <PageContainer className="py-8">
        {/* Header Block */}
        <div className="w-full border-b-2 border-gray-300 pb-4 mb-6">
          <SectionHeading level="h1" className="font-normal text-gray-900">
            NTI {subject.name} ({subject.abbr}) Results
          </SectionHeading>
        </div>

        <p className="text-[15px] text-gray-600 leading-relaxed max-w-4xl mb-8">
          View official result links for different classes and years below. Select your class level to see the published results.
        </p>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative mt-6">
          
          {/* Left Vertical Sidebar (No rounded corners) */}
          <div className="w-full md:w-56 flex-shrink-0 sticky top-24 bg-white border border-gray-200 rounded-none shadow-sm z-10">
            <div className="p-3.5 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Classes</h2>
            </div>
            <div className="flex flex-col py-1.5 max-h-[70vh] overflow-y-auto custom-scroll">
              {CLASS_LEVELS.map((cls) => (
                <button
                  key={cls.slug}
                  onClick={() => scrollToSection(cls.slug)}
                  className={`w-full text-left px-4 py-2 border-b border-gray-100 last:border-0 flex justify-between items-center text-[13px] transition-colors duration-150 ${
                    activeClass === cls.slug 
                      ? 'text-[#007BFF] bg-blue-50/40 font-semibold' 
                      : 'text-gray-600 hover:text-[#007BFF] hover:bg-gray-50'
                  }`}
                >
                  <span>{cls.name}</span>
                  <span className="text-gray-300 font-normal">&rsaquo;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0 border border-gray-200 bg-white shadow-sm divide-y-2 divide-gray-300 rounded-none">
            {CLASS_LEVELS.map((cls) => {
              const classResults = results.filter(r => r.classSlug === cls.slug);
              
              return (
                <div 
                  key={cls.slug} 
                  id={cls.slug} 
                  className="scroll-mt-28 p-6"
                >
                  {/* Section Header */}
                  <div className="pb-3.5 mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-[17px] font-bold text-gray-900">{cls.name}</h3>
                      <span className="text-xs text-gray-400 font-medium block mt-0.5">
                        {cls.number <= 5 ? 'Primary Division' : 'Secondary Division'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-none bg-gray-100 text-gray-500 border border-gray-200">
                      {cls.number <= 5 ? 'Primary' : 'Secondary'}
                    </span>
                  </div>

                  {/* Results & Question Papers List */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Question Papers & Practice Sheets
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] mb-4">
                        {[2025, 2024, 2023].map((y) => (
                          <Link
                            key={y}
                            to={ROUTES.previousYearDetail(subject.slug, cls.slug, y)}
                            className="text-[#007BFF] hover:underline font-semibold inline-flex items-center gap-1.5 bg-blue-50/60 border border-blue-200 px-3 py-1 rounded-sm"
                          >
                            <span>{y} Question Paper (PDF) &rarr;</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Published Exam Results
                      </h4>
                      {loading ? (
                        <p className="text-xs text-gray-500 italic">Loading results...</p>
                      ) : classResults.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px]">
                          {classResults.map((result) => (
                            <a
                              key={result.id}
                              href={result.resultUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline font-medium inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-sm text-xs"
                            >
                              <span>{result.year} Result Sheet PDF</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12.5px] text-gray-400 italic">Official results will be updated post examination.</p>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Related Prep Resources Section (Square corners) */}
        <div className="border-t-2 border-gray-300 pt-10 mt-12 text-left">
          <h2 className="text-[16px] font-bold text-gray-900 mb-6 uppercase tracking-wider">
            Related Prep Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to={ROUTES.awards}
              className="border-2 border-gray-300 rounded-none p-5 hover:border-gray-400 transition-all duration-200 block text-left bg-white shadow-sm"
            >
              <div className="w-8 h-8 rounded-none bg-gray-50 flex items-center justify-center font-bold text-sm mb-3 border-2 border-gray-300 text-gray-600">
                B
              </div>
              <h3 className="font-semibold text-gray-900 text-[14.5px] mb-1">
                Olympiad Workbooks
              </h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal">
                Deepen conceptual clarity with expert study workbooks designed for all classes.
              </p>
            </Link>

            <Link
              to={ROUTES.syllabusPyqs}
              className="border-2 border-gray-300 rounded-none p-5 hover:border-gray-400 transition-all duration-200 block text-left bg-white shadow-sm"
            >
              <div className="w-8 h-8 rounded-none bg-gray-50 flex items-center justify-center font-bold text-sm mb-3 border-2 border-gray-300 text-gray-600">
                P
              </div>
              <h3 className="font-semibold text-gray-900 text-[14.5px] mb-1">
                Mock Sample Sheets
              </h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal">
                Download complimentary sample mock papers to test speed and format levels.
              </p>
            </Link>

            <Link
              to={ROUTES.subjectRankers}
              className="border-2 border-gray-300 rounded-none p-5 hover:border-gray-400 transition-all duration-200 block text-left bg-white shadow-sm"
            >
              <div className="w-8 h-8 rounded-none bg-gray-50 flex items-center justify-center font-bold text-sm mb-3 border-2 border-gray-300 text-gray-600">
                R
              </div>
              <h3 className="font-semibold text-gray-900 text-[14.5px] mb-1">
                Results & Rankers
              </h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal">
                Inspect result release schedules and verify final state rankers announcements.
              </p>
            </Link>
          </div>
        </div>

      </PageContainer>
    </div>
  );
}
