import { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Building2,
  BookOpen,
  FileText,
  LogOut,
  ShieldCheck,
  CreditCard,
  ShieldAlert
} from 'lucide-react';

import { SUBJECTS } from '../../config/subjects';
import { api } from '../../config/api';
import { useSchoolSession } from '../../hooks/useSchoolSession';
import { useAsyncData } from '../../hooks/useAsyncData';
import { ErrorState } from '../../components/ui';
import CompleteProfileWizard from './CompleteProfileWizard';
import PaymentModal from './PaymentModal';
import SubjectUploadModal from './SubjectUploadModal';

import SchoolOverviewTab from './SchoolOverviewTab';
import SchoolRegistrationsTab from './SchoolRegistrationsTab';
import SchoolPaymentTab from './SchoolPaymentTab';
import SchoolVerificationTab from './SchoolVerificationTab';
import SchoolAdmitCardsTab from './SchoolAdmitCardsTab';
import ProgressStepper from './ProgressStepper';

const PRIMARY_BLUE = '#007BFF';
const HEADING_COL  = '#1F2937';
const BORDER_COL   = '#E5E7EB';

export default function SchoolPanelPage() {
  const navigate = useNavigate();
  const { user, status, signOut } = useSchoolSession();
  const schoolId = user?.id;

  const [profileCompleteOverride, setProfileCompleteOverride] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUploadSubject, setActiveUploadSubject] = useState(null);

  const {
    data: panel,
    error: loadError,
    isLoading,
    reload: fetchDocuments,
    setData: setPanel,
  } = useAsyncData(
    () => (schoolId ? api.get(`/api/schools/${schoolId}/students`) : Promise.resolve(null)),
    [schoolId]
  );

  const isListLocked = Boolean(panel?.isListLocked);
  const paymentStatus = panel?.paymentStatus ?? 'none';
  const schoolProfile = panel?.schoolProfile ?? null;

  const documentsBySubject = useMemo(
    () => Object.fromEntries((panel?.documents ?? []).map((doc) => [doc.subjectSlug, doc])),
    [panel]
  );

  const replaceDocuments = useCallback(
    (mapper) => setPanel((prev) => (prev ? { ...prev, documents: mapper(prev.documents ?? []) } : prev)),
    [setPanel]
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1D4ED8] rounded-full animate-spin" />
        <span className="sr-only">Loading your school panel…</span>
      </div>
    );
  }

  if (status === 'anonymous' || !schoolId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
        <div className="text-center">
          <ShieldCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-[#1F2937]">Please sign in</h2>
          <p className="text-gray-500 mt-2 mb-4 max-w-sm">
            Your session has ended. Sign in again to access the school panel.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#1D4ED8] text-white rounded-lg font-bold text-sm hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isProfileComplete = profileCompleteOverride || Boolean(user?.isProfileComplete);

  if (!isProfileComplete) {
    return (
      <CompleteProfileWizard
        schoolId={schoolId}
        onComplete={() => setProfileCompleteOverride(true)}
      />
    );
  }

  const handleUploadSuccess = (uploadData) => {
    replaceDocuments((docs) => [
      ...docs.filter((d) => d.subjectSlug !== uploadData.subjectSlug),
      uploadData,
    ]);
  };

  // Removal is persisted server-side; previously it only dropped the entry from
  // local state, so the document reappeared on the next page load.
  const handleRemoveDocument = async (subjectSlug) => {
    if (isEditingDisabled) return;

    const previous = panel?.documents ?? [];
    replaceDocuments((docs) => docs.filter((d) => d.subjectSlug !== subjectSlug));

    try {
      await api.delete(`/api/schools/${schoolId}/students/${subjectSlug}`);
      toast.success('List removed');
    } catch (err) {
      replaceDocuments(() => previous);
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const SUBJECT_TABS = SUBJECTS.map((s) => ({
    key: s.slug,
    label: s.shortName,
    abbr: s.abbr,
  }));

  const totalStudents = Object.values(documentsBySubject).reduce((acc, doc) => acc + (doc.studentCount || 0), 0);
  const totalFee = totalStudents * 150;

  // Editing is disabled if payment is verified and list is locked, 
  // or if payment is currently under review
  const isEditingDisabled = (isListLocked && paymentStatus === 'verified') || paymentStatus === 'pending';

  // Calculate current stage for the progress tracker
  let currentStage = 2; // Profile is already completed by this point
  if (totalStudents > 0 && paymentStatus === 'none') currentStage = 3;
  if (paymentStatus === 'pending') currentStage = 4;
  if (paymentStatus === 'verified' && isListLocked) currentStage = 5;

  return (
    <>
      <Helmet>
        <title>School Panel – NTI Olympiad</title>
      </Helmet>

      <div className="flex min-h-screen bg-[#F8FAFC] text-left">
        
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 flex-shrink-0 bg-white border-r hidden md:flex flex-col z-10" style={{ borderColor: BORDER_COL }}>
          <div className="p-6 border-b" style={{ borderColor: BORDER_COL }}>
            <div className="flex items-center gap-2.5 mb-1">
              <ShieldCheck size={20} className="text-[#1D4ED8]" strokeWidth={2.5} />
              <h2 className="text-xl font-extrabold tracking-tight" style={{ color: HEADING_COL }}>School Panel</h2>
            </div>
            <p className="text-[11px] font-bold mt-1 uppercase tracking-widest truncate" style={{ color: PRIMARY_BLUE }}>
              {schoolProfile?.schoolName || user?.schoolName || 'School Dashboard'}
            </p>
          </div>
          
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[13px] font-bold transition-colors ${activeTab === 'overview' ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <Building2 size={16} strokeWidth={2.5} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('registrations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[13px] font-bold transition-colors ${activeTab === 'registrations' ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <BookOpen size={16} strokeWidth={2.5} /> Registrations
            </button>
            <button 
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[13px] font-bold transition-colors ${activeTab === 'payment' ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <CreditCard size={16} strokeWidth={2.5} /> Payment
            </button>
            <button 
              onClick={() => setActiveTab('verification')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[13px] font-bold transition-colors ${activeTab === 'verification' ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <ShieldAlert size={16} strokeWidth={2.5} /> Verification
            </button>
            <button 
              onClick={() => setActiveTab('admit-cards')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[13px] font-bold transition-colors ${activeTab === 'admit-cards' ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <FileText size={16} strokeWidth={2.5} /> Admit Cards
            </button>
          </nav>

          {/* Logout at bottom */}
          <div className="p-4 border-t" style={{ borderColor: BORDER_COL }}>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors border border-transparent"
            >
              <LogOut size={16} strokeWidth={2} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto w-full">

          {/* Mobile header with logout */}
          <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between" style={{ borderColor: BORDER_COL }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#1D4ED8]" strokeWidth={2.5} />
              <span className="text-sm font-bold truncate max-w-[200px]" style={{ color: HEADING_COL }}>
                {schoolProfile?.schoolName || user?.schoolName || 'School Panel'}
              </span>
            </div>
            <button onClick={handleLogout} className="text-red-600 text-xs font-semibold flex items-center gap-1">
              <LogOut size={14} /> Logout
            </button>
          </div>

          {/* Mobile tab bar */}
          <div className="md:hidden bg-white border-b px-2 py-2 flex gap-1 overflow-x-auto" style={{ borderColor: BORDER_COL }}>
            {[
              { key: 'overview', label: 'Overview', icon: Building2 },
              { key: 'registrations', label: 'Registrations', icon: BookOpen },
              { key: 'payment', label: 'Payment', icon: CreditCard },
              { key: 'verification', label: 'Verification', icon: ShieldAlert },
              { key: 'admit-cards', label: 'Admit Cards', icon: FileText }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-sm text-[12px] font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.key 
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <tab.icon size={14} strokeWidth={2.5} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full">
            
            <ProgressStepper currentStage={currentStage} />

            {loadError && (
              <ErrorState
                className="mb-6"
                error={loadError}
                onRetry={fetchDocuments}
                title="Could not load your school data"
              />
            )}

            {activeTab === 'overview' && (
              <SchoolOverviewTab 
                schoolProfile={schoolProfile}
                isLoading={isLoading}
                totalStudents={totalStudents}
                totalFee={totalFee}
                isListLocked={isListLocked}
                paymentStatus={paymentStatus}
                setPaymentModalOpen={setPaymentModalOpen}
              />
            )}
            
            {activeTab === 'registrations' && (
              <SchoolRegistrationsTab 
                SUBJECT_TABS={SUBJECT_TABS}
                documentsBySubject={documentsBySubject}
                isLoading={isLoading}
                isEditingDisabled={isEditingDisabled}
                setActiveUploadSubject={setActiveUploadSubject}
                setIsModalOpen={setIsModalOpen}
                handleRemoveDocument={handleRemoveDocument}
              />
            )}

            {activeTab === 'payment' && (
              <SchoolPaymentTab 
                currentStage={currentStage}
                isLoading={isLoading}
                totalStudents={totalStudents}
                totalFee={totalFee}
                paymentStatus={paymentStatus}
                isListLocked={isListLocked}
                setPaymentModalOpen={setPaymentModalOpen}
              />
            )}

            {activeTab === 'verification' && (
              <SchoolVerificationTab 
                currentStage={currentStage} 
                paymentStatus={paymentStatus}
                isListLocked={isListLocked}
              />
            )}

            {activeTab === 'admit-cards' && (
              <SchoolAdmitCardsTab 
                isListLocked={isListLocked}
                paymentStatus={paymentStatus}
                SUBJECT_TABS={SUBJECT_TABS}
                documentsBySubject={documentsBySubject}
                currentStage={currentStage}
              />
            )}
          </div>
        </main>

      </div>

      {/* ── Modals ── */}
      <SubjectUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveUploadSubject(null);
        }}
        activeSubject={activeUploadSubject?.key}
        activeTabLabel={activeUploadSubject?.label}
        schoolId={schoolId}
        onUploadSuccess={handleUploadSuccess}
      />

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        schoolId={schoolId}
        amount={totalFee}
        // Refetch rather than guessing the new state — the server also flips
        // the list lock when a proof is submitted.
        onPaymentSuccess={fetchDocuments}
      />
    </>
  );
}
