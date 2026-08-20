import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { X, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { api } from '../../config/api';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv'
];

export default function SubjectUploadModal({ isOpen, onClose, activeSubject, activeTabLabel, schoolId, onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [studentCountInput, setStudentCountInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file) => {
    if (!studentCountInput || parseInt(studentCountInput) <= 0) {
      toast.error('Please enter the number of students before uploading.');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only PDF, Word, Excel and CSV files are allowed.');
      return;
    }

    // Matches the server's limit — the previous 5 MB message was misleading.
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('File size should not exceed 15MB.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Store the file
      const uploaded = await api.post('/api/upload?folder=olympiad/student-lists', formData);

      // 2. Record it against the school and subject
      const payload = {
        subjectSlug: activeSubject,
        documentUrl: uploaded.url,
        fileName: file.name,
        studentCount: parseInt(studentCountInput, 10)
      };

      const { document } = await api.post(`/api/schools/${schoolId}/students`, payload);

      toast.success(`Document uploaded for ${activeTabLabel}!`);
      onUploadSuccess(document ?? payload);
      setStudentCountInput('');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [studentCountInput, activeSubject, activeTabLabel, schoolId, onUploadSuccess]); // eslint-disable-line

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = null; // Reset input
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-[#007BFF]" />
            Upload for {activeTabLabel}
          </h3>
          <button 
            onClick={onClose} 
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Student Count Input */}
          <div>
            <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-2">
              Number of Students <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="number" 
                min="1"
                placeholder="Enter total students" 
                value={studentCountInput} 
                onChange={(e) => setStudentCountInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] transition-all font-medium placeholder:text-gray-400"
                disabled={isUploading}
              />
            </div>
            <p className="text-[12px] text-gray-500 mt-2 flex items-center gap-1.5">
              <AlertCircle size={14} /> Enter this before selecting your file.
            </p>
          </div>

          {/* Drag & Drop Zone */}
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200
              ${isDragging ? 'border-[#007BFF] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-[#007BFF]/20 border-t-[#007BFF] rounded-full animate-spin mb-4" />
                <p className="text-[14px] font-bold text-gray-900">Uploading File...</p>
                <p className="text-[12px] text-gray-500 mt-1">Please don't close this window.</p>
              </div>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-[#007BFF] text-white' : 'bg-blue-50 text-[#007BFF]'}`}>
                  <UploadCloud size={28} strokeWidth={2} />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">
                  {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
                </h4>
                <p className="text-[13px] text-gray-500 mb-4 max-w-[200px] leading-relaxed">
                  Support for Excel, Word, and PDF files. Max size 5MB.
                </p>
                
                <input
                  type="file"
                  disabled={isUploading}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                <div className="px-5 py-2.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg pointer-events-none">
                  Browse Files
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
