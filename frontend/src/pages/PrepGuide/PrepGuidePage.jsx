import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';
import { ROUTES } from '../../config/routes';
import { 
  Clock, FileText, Download,
  BrainCircuit, Globe, PenTool, Calculator, FlaskConical, Monitor, 
  Landmark
} from 'lucide-react';

const PREP_SECTIONS = [
  { slug: 'introduction', label: 'Introduction' },
  { slug: 'prep-steps', label: 'Preparation Steps' },
  { slug: 'subject-tips', label: 'Subject-wise Preparation' },
  { slug: 'class-tips', label: 'Class-wise Preparation' },
  { slug: 'prep-checklist', label: 'Before You Start' },
  { slug: 'exam-day', label: 'Exam Day Checklist' },
  { slug: 'common-mistakes', label: 'Common Mistakes' },
  { slug: 'resources', label: 'Preparation Resources' }
];

const PREP_STEPS = [
  { title: 'Download the syllabus', icon: Download, desc: 'Obtain the official syllabus for your class. This ensures you only study the topics that will be tested.' },
  { title: 'Practice chapter-wise questions', icon: FileText, desc: 'Solve questions after completing each chapter. This helps identify areas where you need more practice.' },
  { title: 'Solve sample papers', icon: PenTool, desc: 'Familiarize yourself with the question formats. Sample papers provide a clear picture of the difficulty level.' },
  { title: 'Practice previous year papers', icon: Clock, desc: 'Attempt past papers under timed conditions. This is the most accurate way to simulate the real exam.' },
  { title: 'Revise weak topics', icon: BrainCircuit, desc: 'Identify the questions you consistently get wrong. Revisit the concepts behind those specific topics.' }
];

const SUBJECT_TIPS = [
  { title: 'Mathematics', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50', tips: ['Practice daily calculations to improve speed.', 'Understand the logic behind formulas instead of memorizing them.', 'Solve reasoning and logic-based puzzles regularly.'] },
  { title: 'Science', icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50', tips: ['Focus on practical applications of scientific principles.', 'Learn to read and interpret diagrams and charts.', 'Understand the core concepts of physics, chemistry, and biology according to your grade.'] },
  { title: 'English', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50', tips: ['Read extensively to build a strong vocabulary.', 'Practice grammar rules through varied exercises.', 'Solve reading comprehension passages to improve inference skills.'] },
  { title: 'Information Technology', icon: Monitor, color: 'text-purple-600', bg: 'bg-purple-50', tips: ['Familiarize yourself with basic hardware and software terms.', 'Practice fundamental logical reasoning and flowchart concepts.', 'Stay updated with general knowledge about recent technological advancements.'] },
  { title: 'Finance', icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50', tips: ['Understand basic concepts of money, banking, and savings.', 'Solve word problems involving simple interest and percentages.', 'Read about general financial awareness suitable for your age group.'] }
];

export default function PrepGuidePage() {
  const [activeSection, setActiveSection] = useState(PREP_SECTIONS[0].slug);

  // Scrollspy observer for sidebar highlighting
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    };

    const sectionElements = PREP_SECTIONS.map(sec => 
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

    // Bottom-of-page detector
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection(PREP_SECTIONS[PREP_SECTIONS.length - 1].slug);
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
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-slate-800 text-left">
      <Helmet>
        <title>Olympiad Preparation Guide – NTI Olympiad</title>
        <meta name="description" content="Practical preparation guide for NTI Olympiad. Access subject-wise tips, checklists, and resources for Mathematics, Science, English, IT, and Finance." />
        <link rel="canonical" href="https://ntiolympiad.in/prep-guide" />
      </Helmet>

      <div className="bg-white border-b border-gray-200 pt-6 pb-4">
        <PageContainer>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Olympiad Preparation Guide' }
          ]} />
          <SectionHeading level="h1" className="font-bold text-gray-900 mt-6 mb-2">
            Olympiad Preparation Guide
          </SectionHeading>
          <p className="text-gray-600 max-w-3xl text-sm md:text-base">
            A practical resource hub for students, parents, and teachers preparing for the NTI Olympiad.
          </p>
        </PageContainer>
      </div>

      <PageContainer className="py-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          
          {/* Left Vertical Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 sticky top-24 bg-white border border-gray-200 rounded-lg shadow-sm z-10 p-2 hidden md:block">
            <div className="px-4 py-3 border-b border-gray-100 mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sections</span>
            </div>
            <ul className="space-y-1">
              {PREP_SECTIONS.map((sec) => (
                <li key={sec.slug}>
                  <button
                    onClick={() => scrollToSection(sec.slug)}
                    className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      activeSection === sec.slug
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {sec.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-12 min-w-0 pb-10">
            
            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Introduction</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Olympiad preparation requires a different approach than regular school exams. While school exams often test your memory of the curriculum, Olympiads test how well you can apply those concepts to unfamiliar and complex problems.</p>
                <p>Knowing the exact syllabus is your most important first step. The NTI Olympiad questions are designed around specific class-level topics, so studying outside the syllabus wastes valuable time.</p>
                <p>Consistent, daily practice is more effective than cramming before the exam. Regular problem-solving builds the speed and accuracy necessary to perform well under timed conditions.</p>
              </div>
            </section>

            {/* 2. Preparation Steps */}
            <section id="prep-steps" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Preparation Steps</h2>
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                {PREP_STEPS.map((step, i) => (
                  <li key={i}>
                    <strong className="text-gray-900">{step.title}</strong>: {step.desc}
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Subject-wise Preparation Tips */}
            <section id="subject-tips" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Subject-wise Preparation Tips</h2>
              <div className="space-y-6">
                {SUBJECT_TIPS.map((subject, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{subject.title}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {subject.tips.map((tip, j) => (
                        <li key={j}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Class-wise Preparation */}
            <section id="class-tips" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Class-wise Preparation</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Classes 1–4</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Focus heavily on concept building.</li>
                    <li>Prioritize accuracy over speed.</li>
                    <li>Parental guidance is crucial for routines.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Classes 5–7</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Develop strong logical reasoning.</li>
                    <li>Ensure consistent chapter-wise practice.</li>
                    <li>Start strict time management.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Classes 8–10</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Take regular, full mock tests.</li>
                    <li>Dedicate time to analysing mistakes.</li>
                    <li>Practice higher-order thinking questions.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Before You Start */}
            <section id="prep-checklist" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Before You Start</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {['Download syllabus', 'Review exam pattern', 'Understand marking scheme', 'Collect study material', 'Prepare revision notes'].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 6. Exam Day Checklist */}
            <section id="exam-day" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Exam Day Checklist</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {['Admit card', 'Reporting time', 'Required stationery', 'Reading instructions', 'Time management', 'Reviewing answers before submission'].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 7. Common Preparation Mistakes */}
            <section id="common-mistakes" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Common Preparation Mistakes</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Good Practice</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {['Understand concepts', 'Solve previous year papers', 'Review mistakes', 'Revise regularly', 'Practice under exam conditions'].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Avoid</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {['Memorizing answers', 'Ignoring weak topics', 'Skipping revision', 'Leaving questions unanswered (where applicable)', 'Spending too much time on one question'].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 8. Preparation Resources */}
            <section id="resources" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#007BFF] pb-2">Preparation Resources</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {[
                  { title: 'Official Syllabus', link: ROUTES.syllabusPyqs },
                  { title: 'Sample Papers', link: ROUTES.syllabusPyqs },
                  { title: 'Previous Year Papers', link: ROUTES.previousYear },
                  { title: 'Exam Pattern', link: ROUTES.markingScheme },
                  { title: 'Marking Scheme', link: ROUTES.markingScheme },
                  { title: 'FAQs', link: ROUTES.faq }
                ].map((res, i) => (
                  <li key={i}>
                    <Link to={res.link} className="text-blue-600 hover:underline font-medium">
                      {res.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        </div>
      </PageContainer>
    </div>
  );
}
