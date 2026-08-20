import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';

const subjects = [
  { name: 'Mathematics Olympiad', id: 'math' },
  { name: 'Science Olympiad', id: 'science' },
  { name: 'English Olympiad', id: 'english' },
  { name: 'Information Technology Olympiad', id: 'it' },
  { name: 'Finance Olympiad', id: 'finance' }
];

export default function MarkingScheme() {
  const [activeSubject, setActiveSubject] = useState(subjects[0].id);

  const scrollToSection = (id) => {
    setActiveSubject(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Marking Scheme and Exam Pattern – NTI Olympiad</title>
        <meta name="description" content="Understand the marking criteria, distribution of marks, and total questions across classes for the NTI Olympiad." />
        <link rel="canonical" href="https://ntiolympiad.in/marking-scheme" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Marking Scheme and Exam Pattern – NTI Olympiad" />
        <meta property="og:description" content="Understand the marking criteria, distribution of marks, and total questions across classes for the NTI Olympiad." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content="https://ntiolympiad.in/marking-scheme" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marking Scheme and Exam Pattern – NTI Olympiad" />
        <meta name="twitter:description" content="Understand the marking criteria, distribution of marks, and total questions across classes for the NTI Olympiad." />
        <meta name="twitter:image" content="https://ntiolympiad.in/about_nti_banner.png" />
      </Helmet>
      {/* ── Breadcrumb ── */}
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Marking Scheme' }
      ]} />

      {/* ── Main Layout ── */}
      <PageContainer className="py-8">
        <div className="w-full border-b border-gray-300 pb-4 mb-8">
          <SectionHeading level="h1">Level 1 Exam Pattern and Marking Scheme</SectionHeading>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          
          {/* ── Left Sidebar ── */}
          <div className="w-full md:w-64 flex-shrink-0 sticky top-24 bg-white border border-gray-100 shadow-sm rounded-sm z-10">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Level 1 Marking Scheme</h2>
            </div>
            <div className="flex flex-col py-2">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => scrollToSection(sub.id)}
                  className={`w-full text-left px-4 py-2.5 border-b border-gray-100 flex justify-between items-center text-[14px] transition-colors duration-200 ${
                    activeSubject === sub.id 
                    ? 'text-[#007BFF] bg-blue-50/50 font-medium' 
                    : 'text-[#007BFF] hover:bg-gray-50'
                  }`}
                >
                  NTI {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right Content ── */}
          <div className="flex-1 min-w-0">
            <div className="space-y-16">
              
              {/* Note about offline mode */}
              <div className="bg-[#f0f8ff] border-l-4 border-[#28589c] p-4 rounded shadow-sm">
                <p className="text-[#333] font-semibold text-[16px]">Important Information:</p>
                <p className="text-[#555] text-[15px] mt-1">The examination is conducted <strong>strictly offline in school premises</strong>.</p>
              </div>

              {subjects.map((subject) => (
                <div key={subject.id} id={subject.id} className="scroll-mt-24">
                  <h3 className="text-[24px] font-normal text-gray-800 mb-6">NTI {subject.name}</h3>
                  <div className="overflow-x-auto shadow-sm rounded-sm border border-gray-200">
                    <table className="w-full text-left text-sm text-gray-500">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                          <th className="px-6 py-3">Topic/Section</th>
                          <th className="px-6 py-3">No. of Questions</th>
                          <th className="px-6 py-3">Marks per Question</th>
                          <th className="px-6 py-3">Total Marks</th>
                          <th className="px-6 py-3">Total Time (in minutes)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="bg-white">
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                            General Section
                          </td>
                          <td className="px-6 py-4">30</td>
                          <td className="px-6 py-4">1</td>
                          <td className="px-6 py-4">30</td>
                          <td className="px-6 py-4"></td>
                        </tr>
                        <tr className="bg-white">
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                            Achiever's Section
                          </td>
                          <td className="px-6 py-4">10</td>
                          <td className="px-6 py-4">2</td>
                          <td className="px-6 py-4">20</td>
                          <td className="px-6 py-4"></td>
                        </tr>
                        <tr className="bg-[#f4f8fc] font-bold text-[#111]">
                          <td className="whitespace-nowrap px-6 py-4">Grand Total</td>
                          <td className="px-6 py-4">40</td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">50</td>
                          <td className="px-6 py-4 text-[#28589c]">60</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  );
}
