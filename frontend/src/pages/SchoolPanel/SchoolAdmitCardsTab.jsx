import { Lock, Download, CheckCircle2 } from 'lucide-react';

export default function SchoolAdmitCardsTab({
  SUBJECT_TABS,
  documentsBySubject,
  currentStage
}) {
  const isVerified = currentStage === 5;

  if (!isVerified) {
    return (
      <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Lock size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2937] mb-2">Admit Cards Locked</h3>
        <p className="text-[14px] text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
          You must complete all previous stages (Registration, Payment, and Admin Verification) before you can download your admit cards.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2 bg-[#F9FAFB]">
        <CheckCircle2 size={16} className="text-emerald-600" />
        <h2 className="text-[13px] font-bold text-[#1F2937] uppercase tracking-wider">Download Admit Cards</h2>
      </div>
      
      <div className="divide-y divide-[#E5E7EB]">
        {SUBJECT_TABS.map((subject) => {
          const doc = documentsBySubject[subject.key];
          if (!doc) return null;

          return (
            <div key={subject.key} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="text-[14px] font-bold text-[#1F2937]">{subject.label}</h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{doc.studentCount} Students</p>
              </div>
              <button 
                onClick={() => alert('Downloading admit cards for ' + subject.label)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm text-[12px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors"
              >
                <Download size={14} />
                Download PDF
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
