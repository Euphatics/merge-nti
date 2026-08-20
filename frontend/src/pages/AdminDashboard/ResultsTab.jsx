import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ExternalLink, Upload, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '../../config/subjects';
import { API_BASE_URL, secureFetch } from '../../config/api';
import { validatePDFMagicBytes } from '../../utils/security';
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

export default function ResultsTab() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState(null);


  
  const [newResult, setNewResult] = useState({
    subjectSlug: SUBJECTS[0].slug,
    classSlug: CLASS_LEVELS[0].slug,
    year: new Date().getFullYear(),
    resultUrl: ''
  });

  const fetchResults = useCallback(async () => {
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/results?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    let active = true;
    secureFetch(`${API_BASE_URL}/api/results?page=${page}&limit=${limit}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        if (active) {
          setResults(data.results || []);
          setTotal(data.total || 0);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [page, limit]);

  // Upload PDF to Cloudinary and auto-fill the URL
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
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

      const res = await secureFetch(`${API_BASE_URL}/api/upload?folder=olympiad/results`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload PDF');
      }

      const data = await res.json();
      setNewResult(prev => ({ ...prev, resultUrl: data.url }));
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newResult.resultUrl) {
      toast.error('Please upload a PDF or enter a URL first.');
      return;
    }
    setSaving(true);
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/admin/results`, {
        method: 'POST',
        body: JSON.stringify(newResult),
      });
      if (!res.ok) throw new Error('Failed to add result');
      setNewResult({ ...newResult, resultUrl: '' });
      toast.success('Result added successfully');
      fetchResults();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/admin/results/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete result');
      setResults(results.filter(r => r.id !== id));
      toast.success('Result deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="bg-white border-b px-8 py-6 flex items-center justify-between text-left" style={{ borderColor: BORDER_COL }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: HEADING_COL }}>Results</h1>
          <p className="text-sm mt-1" style={{ color: MUTED_COL }}>Upload and manage exam result PDFs. They will appear on the public Results page automatically.</p>
        </div>
      </div>

      <div className="p-8 max-w-full text-left">
        {/* Add New Form */}
        <div className="bg-white border rounded-sm shadow-sm p-6 mb-6" style={{ borderColor: BORDER_COL }}>
          <h2 className="text-[14px] font-bold text-gray-900 mb-4 uppercase tracking-wider">Add New Result</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Subject</label>
                <select 
                  value={newResult.subjectSlug} 
                  onChange={e => setNewResult({...newResult, subjectSlug: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  {SUBJECTS.map(s => <option key={s.slug} value={s.slug}>{s.name} ({s.abbr})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Class</label>
                <select 
                  value={newResult.classSlug} 
                  onChange={e => setNewResult({...newResult, classSlug: e.target.value})}
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
                  value={newResult.year} 
                  onChange={e => setNewResult({...newResult, year: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Upload PDF or paste URL */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Result PDF</label>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Upload button */}
                <label className={`inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-sm cursor-pointer transition-colors ${uploading ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600'}`}>
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-[13px] font-semibold">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} strokeWidth={2} />
                      <span className="text-[13px] font-semibold">Upload PDF</span>
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

                {/* URL input */}
                <input 
                  type="text" 
                  placeholder="Paste result URL here..."
                  value={newResult.resultUrl} 
                  onChange={e => setNewResult({...newResult, resultUrl: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-sm text-[13px] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Show uploaded file indicator */}
              {newResult.resultUrl && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <FileText size={14} className="text-emerald-600 flex-shrink-0" />
                  <a href={newResult.resultUrl} target="_blank" rel="noreferrer" className="text-[12px] text-emerald-700 font-medium truncate hover:underline">
                    {newResult.resultUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button type="submit" disabled={saving || uploading || !newResult.resultUrl} className="px-5 py-2.5 bg-[#007BFF] text-white rounded-sm text-[13px] font-bold hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus size={14} strokeWidth={2.5} /> {saving ? 'Adding...' : 'Add Result'}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white border rounded-sm shadow-sm overflow-hidden" style={{ borderColor: BORDER_COL }}>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading results...</div>
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
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Link</th>
                    <th className="px-5 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px] text-right border-l border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500 text-[13px]">No results found. Upload a result PDF above to get started.</td></tr>
                  ) : results.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-900 text-[13px]">{SUBJECTS.find(s=>s.slug===r.subjectSlug)?.name || r.subjectSlug}</td>
                      <td className="px-5 py-4 text-gray-700 font-medium text-[13px]">Class {r.classSlug.replace('class-', '')}</td>
                      <td className="px-5 py-4 text-gray-700 font-medium text-[13px]">{r.year}</td>
                      <td className="px-5 py-4">
                        {r.resultUrl && <a href={r.resultUrl} target="_blank" rel="noreferrer" className="text-[#007BFF] font-semibold text-[13px] hover:underline flex items-center gap-1.5"><ExternalLink size={14}/> View Result</a>}
                      </td>
                        <td className="px-5 py-4 text-right border-l border-gray-200">
                          <button onClick={() => setDeleteTargetId(r.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete result">
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
                  <div className="text-[13px] text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{(page - 1) * limit + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-gray-900">{total}</span> results
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-3 py-1.5 border border-gray-300 rounded-sm text-[13px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-3 py-1.5 border border-gray-300 rounded-sm text-[13px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Result Entry"
        message="Are you sure you want to delete this result? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
