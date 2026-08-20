import { useState, useEffect } from 'react';
import { Calendar, Save, AlertCircle, CheckCircle2, Clock, Settings } from 'lucide-react';
import { API_BASE_URL, secureFetch } from '../../config/api';
import { handleSessionExpiration } from '../../utils/security';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Skeleton from '../../components/Skeleton';

const HEADING_COL = '#1F2937';
const MUTED_COL = '#9CA3AF';
const BORDER_COL = '#E5E7EB';
const BG_SECTION = '#F9FAFB';

export default function SettingsTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentWindow, setCurrentWindow] = useState(null);

  useEffect(() => {
    let active = true;
    secureFetch(`${API_BASE_URL}/api/admin/registration-window`)
      .then(async (res) => {
        if (!res.ok) {
          if (handleSessionExpiration(res, navigate)) return;
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        if (active && data.window) {
          setCurrentWindow(data.window);
          setStartDate(data.window.startDate.slice(0, 10));
          setEndDate(data.window.endDate.slice(0, 10));
        }
      })
      .catch((err) => console.error('Error loading registration window:', err))
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [navigate]);

  const handleSave = async () => {
    if (!startDate || !endDate) {
      toast.error('Both start date and end date are required.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('Start date must be before end date.');
      return;
    }

    setSaving(true);
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/admin/registration-window`, {
        method: 'PUT',
        body: JSON.stringify({
          startDate: `${startDate}T00:00:00.000Z`,
          endDate: `${endDate}T23:59:59.999Z`,
        }),
      });

      if (!res.ok) {
        if (handleSessionExpiration(res, navigate)) return;
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
        return;
      }

      const data = await res.json();
      setCurrentWindow(data.window);
      toast.success('Registration window updated successfully!');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatus = () => {
    if (!currentWindow) return { label: 'Not Set', color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' };
    const now = new Date();
    const start = new Date(currentWindow.startDate);
    const end = new Date(currentWindow.endDate);
    if (now < start) return { label: 'Upcoming', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
    if (now > end) return { label: 'Closed', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
    return { label: 'Open', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' };
  };

  const status = getStatus();

  const formatDisplayDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-IN', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b px-8 py-6 flex items-center justify-between" style={{ borderColor: BORDER_COL }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: HEADING_COL }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: MUTED_COL }}>Manage registration window and platform settings.</p>
        </div>
      </div>

      <div className="p-8 max-w-3xl">
        {/* Registration Window Card */}
        <div className="bg-white rounded-sm border overflow-hidden" style={{ borderColor: BORDER_COL }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: BORDER_COL, background: BG_SECTION }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#EFF6FF' }}>
                <Calendar size={15} style={{ color: '#1D4ED8' }} strokeWidth={2} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: HEADING_COL }}>Registration Window</h2>
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider border"
              style={{ color: status.color, background: status.bg, borderColor: status.border }}
            >
              {status.label === 'Open' && <CheckCircle2 size={12} strokeWidth={2.5} />}
              {status.label === 'Closed' && <AlertCircle size={12} strokeWidth={2.5} />}
              {status.label === 'Upcoming' && <Clock size={12} strokeWidth={2.5} />}
              {status.label === 'Not Set' && <Settings size={12} strokeWidth={2.5} />}
              {status.label}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton width="100%" height="44px" borderRadius="6px" />
                <Skeleton width="100%" height="44px" borderRadius="6px" />
              </div>
            ) : (
              <>
                {/* Current Window Info */}
                {currentWindow && (
                  <div
                    className="mb-6 p-4 rounded-sm border text-[13px]"
                    style={{ background: BG_SECTION, borderColor: BORDER_COL }}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Current Window</p>
                    <p className="font-semibold" style={{ color: HEADING_COL }}>
                      {formatDisplayDate(currentWindow.startDate)} — {formatDisplayDate(currentWindow.endDate)}
                    </p>
                    <p className="text-gray-500 mt-1 text-[12px]">
                      Last updated: {formatDisplayDate(currentWindow.updatedAt)}
                    </p>
                  </div>
                )}

                {!currentWindow && (
                  <div
                    className="mb-6 p-4 rounded-sm border text-[13px] flex items-center gap-2"
                    style={{ background: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }}
                  >
                    <AlertCircle size={16} />
                    <span className="font-medium">No registration window is set. All school registrations are currently blocked.</span>
                  </div>
                )}

                {/* Date Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-[13px] border rounded-sm outline-none transition-colors border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-[13px] border rounded-sm outline-none transition-colors border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-[13px] font-bold text-white transition-colors"
                  style={{
                    background: saving ? '#93C5FD' : '#1D4ED8',
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#1E40AF'; }}
                  onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = '#1D4ED8'; }}
                >
                  <Save size={14} strokeWidth={2.5} />
                  {saving ? 'Saving...' : 'Save Registration Window'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
