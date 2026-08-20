import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ExternalLink, Upload, FileText, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '../../config/subjects';
import { validatePDFMagicBytes } from '../../utils/security';
import { API_BASE_URL, secureFetch } from '../../config/api';
import ConfirmModal from '../../components/ConfirmModal';

const HEADING_COL  = '#1F2937';
const MUTED_COL    = '#9CA3AF';
const BORDER_COL   = '#E5E7EB';

const CLASS_LEVELS = [
  { slug: 'class-1', name: 'Class 1' },
  { slug: 'class-2', name: 'Class 2' },
  { slug: 'class-3', name: 'Class 3' },
  { slug: 'class-4', name: 'Class 4' },
  { slug: 'class-5', name: 'Class 5' },
  { slug: 'class-6', name: 'Class 6' },
  { slug: 'class-7', name: 'Class 7' },
  { slug: 'class-8', name: 'Class 8' },
  { slug: 'class-9', name: 'Class 9' },
  { slug: 'class-10', name: 'Class 10' }
];

const LOCAL_STORAGE_KEY = 'nti_pyqs_backup_v1';

const getStoredPyqs = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveStoredPyqs = (pyqs) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pyqs));
  } catch (e) {
    console.error('Failed to cache PYQs locally', e);
  }
};

export default function PYQSTab() {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  
  const [newPyq, setNewPyq] = useState({
    subjectSlug: SUBJECTS[0].slug,
    classSlug: CLASS_LEVELS[0].slug,
    year: new Date().getFullYear(),
    type: 'Question Paper',
    paperUrl: ''
  });

  const fetchPyqs = useCallback(async () => {
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/pyqs`);
      if (res.ok) {
        const data = await res.json();
        const list = data.pyqs || data.results || [];
        setPyqs(list);
        saveStoredPyqs(list);
      } else {
        const fallback = getStoredPyqs();
        setPyqs(fallback);
        if (!fallback.length) setError('Failed to load PYQs from server.');
      }
    } catch (err) {
      console.warn('API PYQ fetch warning, using local cache fallback:', err);
      const fallback = getStoredPyqs();
      setPyqs(fallback);
      if (!fallback.length) setError('Failed to load PYQs from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    secureFetch(`${API_BASE_URL}/api/pyqs`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          const list = data.pyqs || data.results || [];
          if (active) {
            setPyqs(list);
            saveStoredPyqs(list);
          }
        } else {
          const fallback = getStoredPyqs();
          if (active) {
            setPyqs(fallback);
            if (!fallback.length) setError('Failed to load PYQs from server.');
          }
        }
      })
      .catch((err) => {
        console.warn('API PYQ fetch warning, using local cache fallback:', err);
        const fallback = getStoredPyqs();
        if (active) {
          setPyqs(fallback);
          if (!fallback.length) setError('Failed to load PYQs from server.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF document.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 15MB.');
      return;
    }

    // Binary Magic Bytes Validation (%PDF- / 0x25 0x50 0x44 0x46 0x2D)
    const isValidPdfHeader = await validatePDFMagicBytes(file);
    if (!isValidPdfHeader) {
      toast.error('Security Alert: Selected file is corrupted or not an authentic PDF document.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await secureFetch(`${API_BASE_URL}/api/upload?folder=olympiad/pyqs`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload PDF file');
      }

      const data = await res.json();
      setNewPyq(prev => ({ ...prev, paperUrl: data.url }));
      toast.success('PDF uploaded and verified successfully.');
    } catch (err) {
      toast.error(err.message || 'Upload failed. You can paste a PDF direct link instead.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPyq.paperUrl) {
      toast.error('Please upload a PDF or enter a valid PDF URL first.');
      return;
    }
    setSaving(true);
    
    const pyqEntry = {
      id: Date.now().toString(),
      ...newPyq,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await secureFetch(`${API_BASE_URL}/api/admin/pyqs`, {
        method: 'POST',
        body: JSON.stringify(newPyq),
      });
      
      if (res.ok) {
        fetchPyqs();
      } else {
        // Local store fallback
        const updated = [pyqEntry, ...pyqs];
        setPyqs(updated);
        saveStoredPyqs(updated);
      }
      setNewPyq({ ...newPyq, paperUrl: '' });
    } catch (err) {
      console.warn('API error, saving locally:', err);
      const updated = [pyqEntry, ...pyqs];
      setPyqs(updated);
      saveStoredPyqs(updated);
      setNewPyq({ ...newPyq, paperUrl: '' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/admin/pyqs/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setPyqs(prev => prev.filter(p => p.id !== id));
      } else {
        const updated = pyqs.filter(p => p.id !== id);
        setPyqs(updated);
        saveStoredPyqs(updated);
      }
      toast.success('Question paper deleted');
    } catch {
      const updated = pyqs.filter(p => p.id !== id);
      setPyqs(updated);
      saveStoredPyqs(updated);
    }
  };

  return (
    <>
      <div className="bg-white border-b px-8 py-6 flex items-center justify-between text-left" style={{ borderColor: BORDER_COL }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: HEADING_COL }}>Previous Question Papers (PYQs)</h1>
          <p className="text-sm mt-1" style={{ color: MUTED_COL }}>Upload and publish previous year question papers and solution keys for students.</p>
        </div>
      </div>

      <div className="p-8 max-w-full text-left">
        {/* Add New Form */}
        <div className="bg-white border rounded-sm shadow-sm p-6 mb-6" style={{ borderColor: BORDER_COL }}>
          <h2 className="text-[14px] font-bold text-gray-900 mb-4 uppercase tracking-wider">Upload New PYQ Paper</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Subject</label>
                <select 
                  value={newPyq.subjectSlug} 
                  onChange={e => setNewPyq({...newPyq, subjectSlug: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  {SUBJECTS.map(s => <option key={s.slug} value={s.slug}>{s.name} ({s.abbr})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Class</label>
                <select 
                  value={newPyq.classSlug} 
                  onChange={e => setNewPyq({...newPyq, classSlug: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  {CLASS_LEVELS.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Year</label>
                <input 
                  type="number" 
                  required
                  value={newPyq.year} 
                  onChange={e => setNewPyq({...newPyq, year: parseInt(e.target.value) || new Date().getFullYear()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Document Type</label>
                <select 
                  value={newPyq.type} 
                  onChange={e => setNewPyq({...newPyq, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option value="Question Paper">Question Paper</option>
                  <option value="Answer Key">Answer Key & Solutions</option>
                </select>
              </div>
            </div>

            {/* Upload PDF or paste URL */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Paper PDF Document</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className={`inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-sm cursor-pointer transition-colors ${uploading ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600'}`}>
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-[13px] font-semibold">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} strokeWidth={2} />
                      <span className="text-[13px] font-semibold">Upload PDF File</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept=".pdf,application/pdf" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    disabled={uploading}
                  />
                </label>

                <span className="self-center text-[11px] font-bold text-gray-400 uppercase">or</span>

                <input 
                  type="text" 
                  placeholder="Paste direct PDF document URL here..."
                  value={newPyq.paperUrl} 
                  onChange={e => setNewPyq({...newPyq, paperUrl: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              {newPyq.paperUrl && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <FileText size={14} className="text-emerald-600 flex-shrink-0" />
                  <a href={newPyq.paperUrl} target="_blank" rel="noreferrer" className="text-[12px] text-emerald-700 font-medium truncate hover:underline">
                    {newPyq.paperUrl}
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saving || uploading || !newPyq.paperUrl} 
                className="px-5 py-2.5 bg-[#007BFF] text-white rounded-sm text-[13px] font-bold hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} strokeWidth={2.5} /> {saving ? 'Publishing...' : 'Publish PYQ Paper'}
              </button>
            </div>
          </form>
        </div>

        {/* PYQ List */}
        <div className="bg-white border rounded-sm shadow-sm overflow-hidden" style={{ borderColor: BORDER_COL }}>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading question papers...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 border-b" style={{ borderColor: BORDER_COL }}>
                  <tr>
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Subject</th>
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Class</th>
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Year</th>
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Document Type</th>
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Link</th>
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px] text-right border-l border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pyqs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 text-[13px]">
                        No previous question papers found. Upload a PYQ PDF document above to publish.
                      </td>
                    </tr>
                  ) : (
                    pyqs.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-4 font-bold text-gray-900 text-[13px]">
                          {SUBJECTS.find(s => s.slug === p.subjectSlug)?.name || p.subjectSlug}
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-medium text-[13px]">
                          Class {p.classSlug?.replace('class-', '')}
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-medium text-[13px]">{p.year}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[11px] font-semibold border ${p.type === 'Answer Key' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                            <BookOpen size={12} /> {p.type || 'Question Paper'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {p.paperUrl ? (
                            <a href={p.paperUrl} target="_blank" rel="noreferrer" className="text-[#007BFF] font-semibold text-[13px] hover:underline flex items-center gap-1.5">
                              <ExternalLink size={14} /> View PDF
                            </a>
                          ) : (
                            <span className="text-gray-400 text-[12px] italic">No file attached</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right border-l border-gray-200">
                          <button onClick={() => setDeleteTargetId(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete paper">
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Question Paper"
        message="Are you sure you want to delete this previous question paper entry? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
