import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';
import { 
  Trophy, 
  Medal, 
  Award, 
  BookOpen, 
  Users, 
  GraduationCap 
} from 'lucide-react';

const AWARDS_SECTIONS = [
  { slug: 'guidelines', label: 'Key Guidelines' },
  { slug: 'student-awards', label: 'Student Ranks & Prizes' },
  { slug: 'school-awards', label: 'School Excellence' },
  { slug: 'educator-awards', label: 'Educator Recognition' },
];

export default function AwardsPage() {
  const [activeSection, setActiveSection] = useState(AWARDS_SECTIONS[0].slug);

  // Scrollspy observer for sidebar highlighting
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    };

    const sectionElements = AWARDS_SECTIONS.map(sec => 
      document.getElementById(sec.slug)
    ).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionElements.forEach(el => observer.observe(el));

    // Bottom-of-page detector to make sure last item is highlighted
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection(AWARDS_SECTIONS[AWARDS_SECTIONS.length - 1].slug);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      sectionElements.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (slug) => {
    setActiveSection(slug);
    const element = document.getElementById(slug);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-800 text-left">
      <Helmet>
        <title>Awards and Recognition – NTI Olympiad Winners</title>
        <meta name="description" content="Discover student ranks, cash prizes, shields, gold/silver/bronze medals, and school certificates awarded by NTI Olympiad." />
        <link rel="canonical" href="https://ntiolympiad.in/awards" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Awards and Recognition – NTI Olympiad Winners" />
        <meta property="og:description" content="Discover student ranks, cash prizes, shields, gold/silver/bronze medals, and school certificates awarded by NTI Olympiad." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content="https://ntiolympiad.in/awards" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Awards and Recognition – NTI Olympiad Winners" />
        <meta name="twitter:description" content="Discover student ranks, cash prizes, shields, gold/silver/bronze medals, and school certificates awarded by NTI Olympiad." />
        <meta name="twitter:image" content="https://ntiolympiad.in/about_nti_banner.png" />
      </Helmet>

      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Awards & Recognition' }
      ]} />

      <PageContainer className="py-8">
        {/* Header Block */}
        <div className="w-full border-b-2 border-gray-300 pb-4 mb-6">
          <SectionHeading level="h1" className="font-normal text-gray-900">
            Awards & Recognition – Academic Year 2026-27
          </SectionHeading>
        </div>

        <p className="text-[15px] text-gray-600 leading-relaxed max-w-4xl mb-8">
          The National Testing Initiative (NTI) celebrates academic excellence and hard work. 
          Both students and schools are recognized with prestigious awards, medals, certificates, and scholarships based on national and global metrics.
        </p>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative mt-6">
          
          {/* Left Vertical Sidebar (Square corners, clean list) */}
          <div className="w-full md:w-56 flex-shrink-0 sticky top-24 bg-white border-2 border-gray-300 rounded-none shadow-sm z-10">
            <div className="p-3.5 border-b-2 border-gray-300 bg-gray-50/50">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Award Details</h2>
            </div>
            <div className="flex flex-col py-1.5 max-h-[70vh] overflow-y-auto custom-scroll">
              {AWARDS_SECTIONS.map((sec) => (
                <button
                  key={sec.slug}
                  onClick={() => scrollToSection(sec.slug)}
                  className={`w-full text-left px-4 py-2 border-b border-gray-100 last:border-0 flex justify-between items-center text-[13px] transition-colors duration-150 ${
                    activeSection === sec.slug 
                      ? 'text-[#007BFF] bg-blue-50/40 font-semibold' 
                      : 'text-gray-600 hover:text-[#007BFF] hover:bg-gray-50'
                  }`}
                >
                  <span>{sec.label}</span>
                  <span className="text-gray-300 font-normal">&rsaquo;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Papers Content Area */}
          <div className="flex-1 w-full space-y-12 min-w-0 pb-10">
            
            {/* Section 1: Key Guidelines */}
            <div id="guidelines" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b-2 border-[#007BFF] pb-2">
                <BookOpen size={18} className="text-gray-500" />
                <h3 className="text-[17px] font-bold text-gray-900">Key Guidelines for NTI Olympiad Awards</h3>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed font-normal">
                To maintain transparency and encourage fair competition, ranking and award allocation follow established guidelines:
              </p>
              <ul className="space-y-3.5 text-[13.5px] text-gray-600 leading-relaxed pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-normal">○</span>
                  <div>
                    Ranking is determined based on the total score. In case of a tie, the time taken to complete the test will be considered.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-normal">○</span>
                  <div>
                    For students in classes 1-10, the awards include medals, certificates, and exciting cash prizes for top performers.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-normal">○</span>
                  <div>
                    Top 3 International rankers will receive special Gold, Silver, and Bronze medals respectively.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-normal">○</span>
                  <div>
                    Top 3 Zonal rankers will also receive Zonal Medals and Certificates of Excellence.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-normal">○</span>
                  <div>
                    Every participating student receives a digital participation certificate. These will be available online in the student dashboard.
                  </div>
                </li>
              </ul>
            </div>

            {/* Section 2: Student Ranks & Prizes */}
            <div id="student-awards" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b-2 border-[#007BFF] pb-2">
                <Medal size={18} className="text-gray-500" />
                <h3 className="text-[17px] font-bold text-gray-900">NTI Olympiads Awards for Students</h3>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed font-normal">
                Awards structure for students appearing online globally:
              </p>

              {/* Table with border-2 border-gray-300 */}
              <div className="border-2 border-gray-300 bg-white overflow-hidden rounded-none mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-300">
                        <th className="py-3 px-4 text-[12px] font-bold text-gray-900 uppercase tracking-wider w-16">Sl No.</th>
                        <th className="py-3 px-4 text-[12px] font-bold text-gray-900 uppercase tracking-wider">Ranking Criteria</th>
                        <th className="py-3 px-4 text-[12px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Grades</th>
                        <th className="py-3 px-4 text-[12px] font-bold text-gray-900 uppercase tracking-wider">Awards</th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px] text-gray-600 divide-y-2 divide-gray-200">
                      <tr>
                        <td className="py-4 px-4 font-semibold text-gray-900">1</td>
                        <td className="py-4 px-4 font-normal">First Place</td>
                        <td className="py-4 px-4 font-normal whitespace-nowrap">Grades 1-10</td>
                        <td className="py-4 px-4 font-normal">
                          Cash + Medal + Tablet
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-semibold text-gray-900">2</td>
                        <td className="py-4 px-4 font-normal">Second Place</td>
                        <td className="py-4 px-4 font-normal whitespace-nowrap">Grades 1-10</td>
                        <td className="py-4 px-4 font-normal">
                          Cash + Medal
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-semibold text-gray-900">3</td>
                        <td className="py-4 px-4 font-normal">Third Place</td>
                        <td className="py-4 px-4 font-normal whitespace-nowrap">Grades 1-10</td>
                        <td className="py-4 px-4 font-normal">
                          Cash + Medal
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-semibold text-gray-900">4</td>
                        <td className="py-4 px-4 font-normal">All other participants (Rest)</td>
                        <td className="py-4 px-4 font-normal whitespace-nowrap">Grades 1-10</td>
                        <td className="py-4 px-4 font-normal">
                          Certificate of Participation (Physical)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-semibold text-gray-900">5</td>
                        <td className="py-4 px-4 font-normal">Participating Schools</td>
                        <td className="py-4 px-4 font-normal">-</td>
                        <td className="py-4 px-4 font-normal">
                          School Participation Certificate Frame
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 3: School Excellence */}
            <div id="school-awards" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b-2 border-[#007BFF] pb-2">
                <Trophy size={18} className="text-gray-500" />
                <h3 className="text-[17px] font-bold text-gray-900">Categories of School Excellence</h3>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed font-normal mb-4">
                NTI Olympiad proudly rewards educational institutions demonstrating outstanding commitment to academic excellence. 
                Awards are determined by cumulative performance and registration enrollment metrics:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-[14.5px] mb-2">Best Performing School</h4>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal mb-4">
                      Awarded to schools whose students achieve the highest cumulative average scores across all subjects and grades.
                    </p>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-3 mt-auto">
                    <p className="text-[13px] font-bold text-[#007BFF] uppercase tracking-wider">
                      Championship Trophy & Citation
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-[14.5px] mb-2">Maximum Participation Award</h4>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal mb-4">
                      Recognizing schools that motivate the highest number of students to enroll and actively participate.
                    </p>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-3 mt-auto">
                    <p className="text-[13px] font-bold text-[#007BFF] uppercase tracking-wider">
                      Shield of Honor
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-[14.5px] mb-2">District Topper School</h4>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal mb-4">
                      Honoring the top-ranked school in each district based on the count of zonal and international rank holders.
                    </p>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-3 mt-auto">
                    <p className="text-[13px] font-bold text-[#007BFF] uppercase tracking-wider">
                      Excellence Plaque
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Educator Recognition */}
            <div id="educator-awards" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b-2 border-[#007BFF] pb-2">
                <GraduationCap size={18} className="text-gray-500" />
                <h3 className="text-[17px] font-bold text-gray-900">Additional Recognition for Educators</h3>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed font-normal">
                Honoring institutional leaders and coordinators who facilitate high standards of exam execution:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-[14.5px] font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                    <Award size={16} className="text-[#007BFF]" />
                    Principal's Leadership Award
                  </h4>
                  <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal">
                    Presented to Principals of the top 20 participating schools globally for visionary leadership and educational excellence support.
                  </p>
                </div>

                <div>
                  <h4 className="text-[14.5px] font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                    <Users size={16} className="text-[#007BFF]" />
                    Best Coordinator Award
                  </h4>
                  <p className="text-[12.5px] text-gray-500 leading-relaxed font-normal">
                    Certificates of Appreciation and special mementos for school coordinators facilitating smooth OMR and online exam execution.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </PageContainer>
    </div>
  );
}
