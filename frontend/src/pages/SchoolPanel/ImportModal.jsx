import { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS (Shared)
   ═══════════════════════════════════════════════════════════════ */
const PRIMARY_BLUE = '#007BFF';
const HEADING_COL  = '#1F2937';
const BODY_COL     = '#4B5563';
const MUTED_COL    = '#9CA3AF';
const BORDER_COL   = '#E5E7EB';
const BG_SECTION   = '#F9FAFB';
const ICON_BG      = '#EFF6FF';
const ICON_COL     = '#1D4ED8';

/* ═══════════════════════════════════════════════════════════════
   FUZZY COLUMN MATCHING
   ═══════════════════════════════════════════════════════════════ */
const COLUMN_ALIASES = {
  standard: [
    'standard', 'class', 'standard/class', 'standard / class',
    'std', 'grade', 'section', 'class name', 'class_name',
  ],
  studentName: [
    'student name', 'students name', "student's name", 'name',
    'student', 'full name', 'fullname', 'pupil name', 'pupil',
    'student_name', 'students_name',
  ],
  contactNumber: [
    'contact number', 'contact no', 'contact', 'phone', 'mobile',
    'phone number', 'mobile number', 'whatsapp', 'phone no',
    'contact_number', 'phone_number', 'mobile_number', 'tel',
  ],
};

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

function matchColumns(headers) {
  const mapping = {};
  const normalised = headers.map(norm);

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const idx = normalised.findIndex((h) => aliases.some((a) => h === a || h.includes(a)));
    if (idx !== -1) mapping[field] = idx;
  }
  return mapping;
}

export default function ImportModal({ open, onClose, onImport, subjectLabel }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  if (!open) return null;

  const resetState = () => {
    setStatus(null);
    setLoading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const processCSV = (csvText, sourceName) => {
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    if (result.errors.length && result.data.length === 0) {
      setStatus({ type: 'error', msg: `Could not parse ${sourceName}. Check the file format.` });
      setLoading(false);
      return;
    }

    const headers = result.meta.fields || [];
    const mapping = matchColumns(headers);

    if (!mapping.studentName) {
      setStatus({
        type: 'error',
        msg: `Could not find a "Student Name" column. Found headers: ${headers.join(', ')}`,
      });
      setLoading(false);
      return;
    }

    const rows = result.data
      .map((row) => {
        const vals = Object.values(row);
        return {
          standard: mapping.standard != null ? (vals[mapping.standard] || '').trim() : '',
          studentName: (vals[mapping.studentName] || '').trim(),
          contactNumber: mapping.contactNumber != null ? (vals[mapping.contactNumber] || '').trim() : '',
        };
      })
      .filter((r) => r.studentName);

    if (rows.length === 0) {
      setStatus({ type: 'error', msg: 'No valid student rows found in the file.' });
      setLoading(false);
      return;
    }

    onImport(rows);
    setStatus({ type: 'success', msg: `${rows.length} student${rows.length > 1 ? 's' : ''} imported successfully!` });
    setLoading(false);

    setTimeout(handleClose, 1200);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus(null);
    setLoading(true);

    const ext = file.name.split('.').pop().toLowerCase();
    const isExcel = ['xlsx', 'xls'].includes(ext);

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const workbook = XLSX.read(ev.target.result, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csvText = XLSX.utils.sheet_to_csv(firstSheet);
          processCSV(csvText, file.name);
        } catch {
          setStatus({ type: 'error', msg: 'Failed to parse Excel file. Make sure it is a valid .xlsx/.xls file.' });
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setStatus({ type: 'error', msg: 'Failed to read the file.' });
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setStatus({ type: 'error', msg: 'Only Excel files (.xlsx, .xls) are supported.' });
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-200"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-sm shadow-2xl w-full max-w-[520px] overflow-hidden border"
          style={{ animation: 'dropdown 0.25s cubic-bezier(0.16, 1, 0.3, 1)', borderColor: BORDER_COL }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BORDER_COL }}>
            <div>
              <h3 className="text-lg font-bold" style={{ color: HEADING_COL }}>Import Students</h3>
              <p className="text-xs mt-0.5" style={{ color: MUTED_COL }}>
                Import into <span className="font-semibold" style={{ color: PRIMARY_BLUE }}>{subjectLabel}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="flex border-b" style={{ borderColor: BORDER_COL }}>
            <div className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold text-[#1E3A8A] border-b-2 border-[#1E3A8A] -mb-px">
              <Upload size={15} strokeWidth={2} />
              Upload Excel File
            </div>
          </div>

          <div className="px-6 py-5">
            <div>
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed
                  rounded-md cursor-pointer transition-colors duration-200
                  hover:border-[#007BFF] hover:bg-blue-50/30"
                style={{ borderColor: '#D1D5DB' }}
              >
                <div
                  className="w-12 h-12 rounded-md flex items-center justify-center"
                  style={{ background: ICON_BG }}
                >
                  <Upload size={22} style={{ color: ICON_COL }} strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: BODY_COL }}>Click to upload a file</p>
                  <p className="text-xs mt-1" style={{ color: MUTED_COL }}>Excel (.xlsx, .xls) only</p>
                </div>
              </label>
              <input
                ref={fileRef}
                id="csv-upload"
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>



            {status && (
              <div
                className={`flex items-start gap-2 mt-4 px-3 py-2.5 rounded-sm text-xs leading-relaxed border ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {status.type === 'success'
                  ? <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" strokeWidth={2} />
                  : <AlertCircle size={15} className="flex-shrink-0 mt-0.5" strokeWidth={2} />
                }
                <span>{status.msg}</span>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 mt-4">
                <div className="w-4 h-4 border-2 border-blue-200 border-t-[#007BFF] rounded-full animate-spin" />
                <span className="text-xs" style={{ color: MUTED_COL }}>Parsing file…</span>
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t" style={{ borderColor: BORDER_COL, background: BG_SECTION }}>
            <p className="text-[11px] leading-relaxed" style={{ color: MUTED_COL }}>
              <span className="font-semibold">Expected columns:</span>{' '}
              Standard/Class, Student's Name, Contact Number.
              Headers are matched flexibly — variations like "Name", "Class", "Phone" etc. work too.
              Supports <span className="font-semibold">.xlsx</span> and <span className="font-semibold">.xls</span> files.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
