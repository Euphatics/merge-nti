import { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { SUBJECTS } from '../../config/subjects';
import { getSyllabusData } from '../../data/syllabusData';

const HEADING_COL  = '#1F2937';
const MUTED_COL    = '#9CA3AF';
const BORDER_COL   = '#E5E7EB';
const BG_SECTION   = '#F9FAFB';

export default function SyllabusTab() {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].slug);
  const [selectedClass, setSelectedClass] = useState('class-1');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSyllabus = useCallback(() => {
    setLoading(true);
    setMessage('');
    const timer = setTimeout(() => {
      const data = getSyllabusData(selectedSubject, selectedClass);
      if (data) {
        setContent(JSON.stringify(data, null, 2));
      } else {
        setContent('{\n  "published": false,\n  "title": "New Syllabus"\n}');
        setMessage('Syllabus not found in local data.');
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedSubject, selectedClass]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      const data = getSyllabusData(selectedSubject, selectedClass);
      if (active) {
        if (data) {
          setContent(JSON.stringify(data, null, 2));
          setMessage('');
        } else {
          setContent('{\n  "published": false,\n  "title": "New Syllabus"\n}');
          setMessage('Syllabus not found in local data.');
        }
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedSubject, selectedClass]);

  const handleSave = () => {
    try {
      JSON.parse(content);
      setSaving(true);
      setMessage('');
      setTimeout(() => {
        setMessage('Mock Save successful. Hook up your own backend here!');
        setSaving(false);
      }, 500);
    } catch (err) {
      setMessage(`Error: Invalid JSON - ${err.message}`);
    }
  };

  return (
    <>
      <div className="bg-white border-b px-8 py-6 flex items-center justify-between text-left" style={{ borderColor: BORDER_COL }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: HEADING_COL }}>Manage Syllabus Content</h1>
          <p className="text-sm mt-1" style={{ color: MUTED_COL }}>Edit the detailed syllabus sections in JSON format.</p>
        </div>
      </div>

      <div className="p-8 max-w-full text-left">
        <div className="bg-white border rounded-sm shadow-sm p-6" style={{ borderColor: BORDER_COL }}>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Subject</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              >
                {SUBJECTS.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Class</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(c => <option key={c} value={`class-${c}`}>Class {c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
               <button 
                  onClick={fetchSyllabus}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-sm text-[13px] font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw size={14} strokeWidth={2.5} /> Reload
                </button>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-sm text-[13px] font-medium mb-4 ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {message}
            </div>
          )}

          <div className="relative">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center border border-gray-200 rounded-sm" style={{ background: BG_SECTION }}>
                <RefreshCw className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[500px] p-4 font-mono text-[13px] border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                style={{ background: BG_SECTION, color: '#374151' }}
                spellCheck={false}
              />
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving || loading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-sm text-[13px] font-bold hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
            >
              <Save size={14} strokeWidth={2.5} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
