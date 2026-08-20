import { useState, useEffect } from 'react';
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
import { API_BASE_URL } from '../../config/api';
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

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const schoolId = storedUser.id;
  const [isProfileComplete, setIsProfileComplete] = useState(storedUser.isProfileComplete || false);

  const [activeTab, setActiveTab] = useState('overview');

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isListLocked, setIsListLocked] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('none');
  const [schoolProfile, setSchoolProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUploadSubject, setActiveUploadSubject] = useState(null);

  const [documentsBySubject, setDocumentsBySubject] = useState({});

  useEffect(() => {
    if (!schoolId) return;

    if (schoolId === 'test') {
      setIsLoading(false);
      setDocumentsBySubject({
        'mathematics': { documentUrl: '#', fileName: 'math_students.xlsx', studentCount: 45 },
        'science': { documentUrl: '#', fileName: 'science_students.pdf', studentCount: 30 }
      });
      return;
    }

    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/schools/${schoolId}/students`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isListLocked !== undefined) setIsListLocked(data.isListLocked);
          if (data.paymentStatus) setPaymentStatus(data.paymentStatus);
          if (data.schoolProfile) setSchoolProfile(data.schoolProfile);
          
          if (data.documents) {
            const mapped = {};
            data.documents.forEach(doc => {
              mapped[doc.subjectSlug] = doc;
            });
            setDocumentsBySubject(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch documents', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [schoolId]);

  if (!schoolId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <ShieldCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-[#1F2937]">Access Denied</h2>
          <p className="text-gray-500 mt-2 mb-4">Please log in to access the school panel.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#007BFF] text-white rounded-sm font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isProfileComplete) {
    return <CompleteProfileWizard schoolId={schoolId} onComplete={() => setIsProfileComplete(true)} />;
  }

  const handleUploadSuccess = (uploadData) => {
    setDocumentsBySubject(prev => ({
      ...prev,
      [uploadData.subjectSlug]: uploadData
    }));
  };

  const handleRemoveDocument = (subjectSlug) => {
    if (isEditingDisabled) return;
    setDocumentsBySubject(prev => {
        const updated = {...prev};
        delete updated[subjectSlug];
        return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
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
              {schoolProfile?.schoolName || storedUser.schoolName || 'School Dashboard'}
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
                {schoolProfile?.schoolName || storedUser.schoolName || 'School Panel'}
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
        onPaymentSuccess={() => setPaymentStatus('pending')}
      />
    </>
  );
}
