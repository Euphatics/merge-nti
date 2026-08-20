import {
  Star,
  School,
  GraduationCap,
  Globe,
  CheckCircle2,
} from 'lucide-react';

const stats = [
  { value: '5+',          label: 'Years of Excellence',    icon: Star,          color: 'bg-amber-500' },
  { value: '10,000+',     label: 'Students Participated',  icon: GraduationCap, color: 'bg-blue-500' },
  { value: '400+',        label: 'Schools Associated',     icon: School,        color: 'bg-emerald-500' },
  { value: 'Pan-India Presence', label: 'Participation Across the Country', icon: Globe, color: 'bg-purple-500' },
];

export default function AboutNTI() {
  return (
    <section id="about-nti" className="w-full bg-white py-10 lg:py-14 border-b border-gray-200">
      <div className="w-full px-6 sm:px-10 lg:px-16 pb-10 lg:pb-12">

        {/* Section Heading */}
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
            About NTI Olympiad
          </h2>
          <div className="h-1.5 w-16 bg-[#007BFF] mt-3 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8">
          {/* Left: Description */}
          <div className="lg:col-span-7">
            <p className="text-[15px] leading-7 text-gray-600 mb-3">
              NTI Olympiad is a countrywide academic competition aimed at finding and encouraging talented students from Classes 1 to 12 in India. It helps the students assess their learning, improve their conceptual clarity, and receive recognition for academic brilliance.
            </p>
            <p className="text-[15px] leading-7 text-gray-600 mb-6">
              The Olympiad is conducted in various subjects including Mathematics, Science, English, General Knowledge, and Logical Reasoning. NTI Olympiad will help students hone their logical reasoning and analytical skills by competing against other students from different institutions and backgrounds.
            </p>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              India's Top Academic Olympiad Forum
            </h3>
            <p className="text-[15px] leading-7 text-gray-600 mb-3">
              The NTI Olympiad has been motivating young talent and creating a positive learning environment for the past five years. Students of CBSE, ICSE, State Board, and International School boards can take part in the competition.
            </p>
            <p className="text-[15px] leading-7 text-gray-600 mb-4">
              Students can register themselves either through Offline Mode at Schools or the Online Mode from Home. The examinations are conducted on three levels—School Level, Zonal Level, and National Level—that offer students an appropriate stage to prove their mettle.
            </p>
            <p className="text-[14px] leading-7 text-gray-500 font-medium italic">
              "We not only organize the exams, but also create opportunities that turn future achievers."
            </p>
          </div>

          {/* Right: Why NTI Olympiad */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Why NTI Olympiad?
              </h4>
              <ul className="space-y-3">
                {[
                  'Nationwide examinations and awards',
                  'Exams for Classes 1-12',
                  'Online/offline examination modes',
                  'Subjects-wise Olympiads',
                  'Ranking of participants',
                  'Logical reasoning and academic excellence',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#007BFF] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-[14px] text-gray-600 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Bar - Full width */}
      <div className="w-full bg-royal-700 text-white py-8 lg:py-10">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center md:border-r border-royal-500/30 last:border-r-0"
                >
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-2 shadow-md`}>
                    <IconComp size={20} strokeWidth={1.8} className="text-white" />
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-white">
                    {item.value}
                  </span>
                  <span className="text-[11px] font-semibold text-royal-300 uppercase tracking-wider mt-1">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
