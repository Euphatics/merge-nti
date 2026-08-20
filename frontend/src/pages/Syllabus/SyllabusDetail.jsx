import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { getSubjectBySlug, getSubjectByName, CLASS_LEVELS } from '../../config/subjects';
import { getSyllabusData } from '../../data/syllabusData';
import { ROUTES } from '../../config/routes';
import { Breadcrumb, PageContainer, SectionHeading, Button } from '../../components/ui';

const CLASSES = ['About', ...CLASS_LEVELS.map((c) => c.name)];

export default function SyllabusDetail({ subjectName: propSubjectName, onMarkingSchemeClick }) {
  const { subjectSlug, subjectName: routeSubjectName } = useParams();

  // Resolve subject: prefer slug-based lookup, fall back to legacy name param
  const subjectFromSlug = subjectSlug ? getSubjectBySlug(subjectSlug) : null;
  const subjectFromName = routeSubjectName ? getSubjectByName(decodeURIComponent(routeSubjectName)) : null;
  const subject = subjectFromSlug || subjectFromName;
  const subjectName = propSubjectName || subject?.shortName || decodeURIComponent(routeSubjectName || subjectSlug || '');
  const resolvedSlug = subject?.slug || subjectSlug || '';
  const [activeClass, setActiveClass] = useState('About');

  const syllabusData = useMemo(() => {
    if (!resolvedSlug) return {};
    const data = {};
    CLASS_LEVELS.forEach(cls => {
      data[cls.slug] = getSyllabusData(resolvedSlug, cls.slug);
    });
    return data;
  }, [resolvedSlug]);

  // Performant scroll spy using IntersectionObserver to avoid layout jank
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    };

    const sectionElements = CLASSES.map(cls => 
      document.getElementById(cls.replace(/\s+/g, '-'))
    ).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const cls = id.replace(/-/g, ' ');
          setActiveClass(cls);
        }
      });
    }, observerOptions);

    sectionElements.forEach(el => observer.observe(el));

    // Simple bottom-of-page detector to make sure Class 10 is highlighted
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveClass((prev) => (prev !== 'Class 10' ? 'Class 10' : prev));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      sectionElements.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (className) => {
    setActiveClass(className);
    const element = document.getElementById(className.replace(/\s+/g, '-'));
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>{`NTI ${subjectName} Syllabus – All Classes`}</title>
        <meta name="description" content={`Detailed syllabus breakdown, topics, and exam guides for NTI ${subjectName} from Class 1 to 10.`} />
        <link rel="canonical" href={`https://ntiolympiad.in/syllabus/${resolvedSlug}`} />
      </Helmet>
      {/* ── Breadcrumb ── */}
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Exam Syllabus and PYQs', path: ROUTES.syllabusPyqs },
        { label: `NTI ${subjectName} Syllabus` }
      ]} />

      <PageContainer className="mt-8 mb-4 border-b border-gray-200 pb-4">
        <SectionHeading level="h2" className="font-normal">
          NTI <span className="font-semibold">{subjectName}</span> Syllabus
        </SectionHeading>
      </PageContainer>

      <PageContainer className="flex flex-col md:flex-row gap-8 relative mt-6">
        {/* Sidebar */}
        <div className="w-full md:w-48 flex-shrink-0">
          <div className="md:sticky md:top-24 bg-white">
            <h3 className="font-semibold text-gray-800 mb-4 px-2">Classes</h3>
            <ul className="flex flex-col border-t border-gray-200">
              {CLASSES.map((cls) => {
                if (cls === 'About') {
                  return (
                    <li key={cls}>
                      <button
                        onClick={() => scrollToSection(cls)}
                        className={`w-full text-left px-3 py-1.5 border-b border-gray-200 flex justify-between items-center text-[13px] transition-colors duration-200 ${
                          activeClass === cls ? 'text-[#00b0ff] font-medium' : 'text-[#00b0ff] hover:text-[#0090e0]'
                        }`}
                      >
                        {cls}
                        <span className="text-lg">›</span>
                      </button>
                    </li>
                  );
                }
                const classSlug = cls.toLowerCase().replace(/\s+/g, '-');
                return (
                  <li key={cls}>
                    <Link
                      to={ROUTES.syllabusClass(resolvedSlug, classSlug)}
                      className="w-full text-left px-3 py-1.5 border-b border-gray-200 flex justify-between items-center text-[13px] transition-colors duration-200 text-[#00b0ff] hover:text-[#0090e0] block"
                    >
                      {cls}
                      <span className="text-lg">›</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-4xl">
          {CLASSES.map((cls) => (
            <div key={cls} id={cls.replace(/\s+/g, '-')} className="mb-14 pt-4">
              {cls === 'About' ? (
                <>
                  <h2 className="text-[28px] font-normal text-gray-900 mb-4">About NTI {subjectName}</h2>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    The National Talent Information (NTI) {subjectName} is designed to test the critical thinking and problem-solving skills of students. Below is the detailed syllabus for various classes. 
                  </p>
                </>
              ) : (
                (() => {
                  const classSlug = cls.toLowerCase().replace(/\s+/g, '-');
                  const classData = syllabusData[classSlug];
                  const topics = classData?.sections?.syllabus?.content || [];
                  return (
                    <>
                      <h2 className="text-[28px] font-normal text-gray-900 mb-6">
                        {subjectName.split(' ')[0]} Olympiad Syllabus for {cls}
                      </h2>
                      
                      <div className="space-y-4 text-[14px] text-gray-800 leading-relaxed mb-6">
                        <p>
                          <strong>Topics Covered:</strong> {topics.length > 0 ? topics.join(', ') : 'Syllabus topics to be updated.'}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="secondary">Sample Paper</Button>
                        <Button 
                          variant="secondary"
                          onClick={(e) => { e.preventDefault(); onMarkingSchemeClick && onMarkingSchemeClick(); }}
                        >
                          Marking Scheme
                        </Button>
                        <Link to={ROUTES.subjectPreviousYear(resolvedSlug)}>
                          <Button variant="secondary">PYQs</Button>
                        </Link>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
