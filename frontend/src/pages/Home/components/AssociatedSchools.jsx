import { School, Calendar, BookOpen, ClipboardList, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AssociatedSchools() {
  // 8 placeholder items to repeat for the seamless loop
  const placeholders = Array.from({ length: 8 }, (_, idx) => idx);

  const quickLinks = [
    { icon: Calendar, title: 'Exam Dates', path: '/exam-dates' },
    { icon: BookOpen, title: 'Syllabus', path: '/syllabus-pyqs' },
    { icon: ClipboardList, title: 'Exam Pattern', path: '/marking-scheme' },
    { icon: FileText, title: 'Sample Papers', path: '/previous-year' },
    { icon: School, title: 'School Registration', path: '/register' },
    { icon: HelpCircle, title: 'FAQs', path: '/faq' },
  ];

  return (
    <section className="w-full bg-[#1E293B] py-12 border-b border-slate-900 overflow-hidden">
      


      <div className="w-full px-6 sm:px-10 lg:px-16 flex flex-col items-start">
        
        {/* Quick Links Menu (Upar Wala Feature) */}
        <div className="w-full max-w-6xl self-center grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 mb-12">
          {quickLinks.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Link
                to={item.path}
                key={idx}
                className="flex flex-col items-center justify-between p-5 sm:p-6 bg-slate-800/50 border border-white/10 rounded-xl group hover:-translate-y-1 hover:border-[#007BFF] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(37,99,235,0.25)] cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-slate-400 group-hover:text-[#007BFF] transition-colors duration-300 mb-4">
                    <IconComponent size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-[#007BFF] transition-colors duration-300 tracking-wide">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-5 text-xs font-bold text-slate-400 group-hover:text-[#007BFF] transition-colors duration-300 uppercase tracking-wider">
                  <span>View Details</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Schools Associated Section Divider */}
        <div className="w-full flex flex-col items-center mb-6">
          <h2 className="text-sm md:text-base font-extrabold text-slate-400 uppercase tracking-widest">
            Schools Participating in NTI Olympiad
          </h2>
          <div className="h-0.5 w-16 bg-slate-700 mt-2 rounded-full"></div>
        </div>

        {/* Marquee sliding container */}
        <div className="w-full relative marquee-container overflow-hidden py-2">
          
          {/* Subtle fading gradients on left and right edges for a premium look */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1E293B] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#1E293B] to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="marquee-track gap-8 flex">
            
            {/* First Set of placeholders */}
            {placeholders.map((i) => (
              <div
                key={`p1-${i}`}
                className="w-36 sm:w-44 h-16 sm:h-20 bg-white/95 border border-slate-700/30 rounded-xl flex items-center justify-center shadow-md select-none flex-shrink-0"
              >
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <School size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold tracking-wider uppercase">School Partner</span>
                </div>
              </div>
            ))}

            {/* Second Set (duplicated for a seamless infinite loop) */}
            {placeholders.map((i) => (
              <div
                key={`p2-${i}`}
                className="w-36 sm:w-44 h-16 sm:h-20 bg-white/95 border border-slate-700/30 rounded-xl flex items-center justify-center shadow-md select-none flex-shrink-0"
              >
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <School size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold tracking-wider uppercase">School Partner</span>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

