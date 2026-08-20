import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Breadcrumb, SectionHeading } from '../../components/ui';
import { 
  Calendar, 
  Info, 
  ArrowRight, 
  GraduationCap
} from 'lucide-react';

const mockDates = [
  { id: 1, section: 'Academic Session Window', description: 'Exam Window', date_value: 'Dec 2025 - Feb 2026' },
  { id: 2, section: 'Registration', description: 'Registration Deadline', date_value: 'November 15, 2025' },
  { id: 3, section: 'Result', description: 'Result Declaration', date_value: 'March 2026' }
];

export default function ExamDatesPage() {
  const [dates] = useState(mockDates);

  const getSectionValue = (sectionName) => {
    return dates.find(d => d.section === sectionName)?.date_value || 'To be announced';
  };

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-slate-800 text-left">
      <Helmet>
        <title>Exam Dates – NTI Olympiad</title>
        <meta name="description" content="View the official NTI Olympiad examination schedule for 2025-26. Students from Class 1 to 10 may participate between December and February." />
        <link rel="canonical" href="https://ntiolympiad.in/exam-dates" />
      </Helmet>

      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Official Schedule' }
      ]} />

      <div className="w-[92%] md:w-[85%] lg:w-[78%] max-w-[1200px] mx-auto py-10 lg:py-14">
        {/* Header Block */}
        <div className="w-full border-b-2 border-gray-200 pb-5 mb-8">
          <SectionHeading level="h1" className="font-normal text-gray-900 !text-3xl lg:!text-[34px]">
            Official Examination Schedule
          </SectionHeading>
        </div>

        <p className="text-[15px] text-gray-600 leading-relaxed mb-10">
          The NTI Olympiad is administered on a national scale. Please review the official examination timeframe and essential directives provided below.
        </p>

        <div className="border border-gray-200 bg-white shadow-sm divide-y divide-gray-200 rounded-xl w-full">
          
          {/* Section 1: Academic Session Window */}
          <div className="p-8 lg:p-10">
            <div className="flex items-center gap-2.5 mb-6">
              <Calendar className="text-gray-500" size={20} />
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                Academic Session Window
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Examination Period</p>
                <p className="text-2xl lg:text-3xl font-bold text-[#1E3A8A]">{getSectionValue('Academic Session Window')}</p>
                <p className="text-sm text-gray-400 mt-3 font-medium">Applicable for all registered schools and independent candidates.</p>
              </div>

              <div className="bg-amber-50/50 border-l-4 border-amber-500 p-5 rounded-r-lg w-full">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="text-amber-600" size={16} />
                  <p className="text-[13px] font-bold text-amber-800 uppercase tracking-wider">Provisional Notice</p>
                </div>
                <p className="text-sm text-amber-800/90 leading-relaxed font-normal">
                  These dates are tentative and subject to administrative revision. Final confirmed examination schedules will be issued directly to all registered participants.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Timeline */}
          <div className="p-8 lg:p-10 bg-gray-50">
             <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-6 border-b pb-4">Detailed Timeline</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dates.filter(d => d.section !== 'Academic Session Window' && d.section !== 'Registration').map(item => (
                  <div key={item.id}>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">{item.description}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-[#1E3A8A]">{item.date_value}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Section 3: Enrollment & Registration */}
          <div className="p-8 lg:p-10">
            <div className="flex items-center gap-2.5 mb-6">
              <GraduationCap className="text-gray-500" size={22} />
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                Enrollment & Registration
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="text-[15px] text-gray-600 leading-relaxed font-normal mb-2">
                  Applications are currently being accepted for the upcoming cycle. We encourage institutional representatives and independent candidates to complete their registration prior to the final deadline to ensure participation.
                </p>
                <p className="text-sm font-semibold text-red-600 bg-red-50 inline-block px-3 py-1.5 rounded-md border border-red-100">
                  Deadline: {getSectionValue('Registration')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-[#1E3A8A] text-white font-medium hover:bg-[#172554] transition-colors flex items-center justify-center gap-2 text-[13px] rounded-lg uppercase tracking-wider whitespace-nowrap"
                >
                  <span>Begin Registration</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center text-[13px] rounded-lg uppercase tracking-wider whitespace-nowrap"
                >
                  <span>Official Support</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
