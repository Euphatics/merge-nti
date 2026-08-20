import { BookOpen, CheckCircle2, AlertCircle, Eye, Trash2, Upload, FileText } from 'lucide-react';

export default function SchoolRegistrationsTab({
  SUBJECT_TABS,
  documentsBySubject,
  isLoading,
  isEditingDisabled,
  setActiveUploadSubject,
  setIsModalOpen,
  handleRemoveDocument
}) {
  const activeSubjectsCount = Object.keys(documentsBySubject).length;

  return (
    <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
        <h2 className="text-[13px] font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
          <BookOpen size={16} className="text-[#1D4ED8]" />
          Subject Registrations
        </h2>
        <span className="text-[12px] font-bold bg-[#EFF6FF] text-[#1D4ED8] px-2.5 py-1 rounded-sm border border-blue-100">
          {activeSubjectsCount} Subjects Registered
        </span>
      </div>

      {isLoading ? (
        <div className="p-5 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-[#E5E7EB]">
          {SUBJECT_TABS.map((subject) => {
            const doc = documentsBySubject[subject.key];
            const isUploaded = !!doc;

            return (
              <div key={subject.key} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold text-[13px] flex-shrink-0 border
                    ${isUploaded ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'}
                  `}>
                    {subject.abbr}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#1F2937]">{subject.label}</h3>
                    {isUploaded ? (
                      <p className="text-[12px] text-[#9CA3AF] mt-0.5 flex items-center gap-1.5 font-medium">
                        <FileText size={13} className="text-gray-400" />
                        <span className="truncate max-w-[150px] sm:max-w-[200px]" title={doc.fileName}>{doc.fileName}</span>
                      </p>
                    ) : (
                      <p className="text-[12px] text-[#9CA3AF] mt-0.5 font-medium">Not Registered</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E5E7EB]">
                  {/* Status / Student Count */}
                  <div className="flex-shrink-0">
                    {isUploaded ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-sm">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">{doc.studentCount} Students</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-sm">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Optional</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0">
                    {isUploaded ? (
                      <div className="flex items-center gap-2">
                        <a 
                          href={doc.documentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-[#9CA3AF] hover:text-[#007BFF] hover:bg-blue-50 rounded-sm transition-colors border border-transparent hover:border-blue-100"
                          title="View Document"
                        >
                          <Eye size={16} />
                        </a>
                        {!isEditingDisabled && (
                          <button 
                            onClick={() => handleRemoveDocument(subject.key)}
                            className="p-1.5 text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors border border-transparent hover:border-red-100"
                            title="Remove Document"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        disabled={isEditingDisabled}
                        onClick={() => {
                          setActiveUploadSubject(subject);
                          setIsModalOpen(true);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-bold transition-colors uppercase tracking-wider border
                          ${isEditingDisabled 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                            : 'bg-[#007BFF] text-white border-[#007BFF] hover:bg-blue-700'
                          }
                        `}
                      >
                        <Upload size={13} strokeWidth={2.5} />
                        Participate
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
