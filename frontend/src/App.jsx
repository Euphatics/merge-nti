import { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import { ROUTES } from './config/routes';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ContactUs = lazy(() => import('./pages/Contact/ContactUsPage'));
const FAQ = lazy(() => import('./pages/FAQ/FAQPage'));
const MarkingScheme = lazy(() => import('./pages/MarkingScheme/MarkingScheme'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/Auth/VerifyEmailPage'));
const SyllabusPYQs = lazy(() => import('./pages/Syllabus/SyllabusPYQs'));
const SyllabusDetail = lazy(() => import('./pages/Syllabus/SyllabusDetail'));
const SyllabusClassPage = lazy(() => import('./pages/Syllabus/SyllabusClassPage'));
const AwardsPage = lazy(() => import('./pages/Awards/AwardsPage'));
const ResultsPage = lazy(() => import('./pages/Results/ResultsPage'));
const SubjectRankersPage = lazy(() => import('./pages/Rankers/SubjectRankersPage'));
const RankersListPage = lazy(() => import('./pages/Rankers/RankersListPage'));
const PreviousYearPage = lazy(() => import('./pages/PreviousYear/PreviousYearPage'));
const SubjectPreviousYearPage = lazy(() => import('./pages/PreviousYear/SubjectPreviousYearPage'));
const PreviousYearDetailPage = lazy(() => import('./pages/PreviousYear/PreviousYearDetailPage'));
const SchoolPanelPage = lazy(() => import('./pages/SchoolPanel/SchoolPanelPage'));
const ExamDatesPage = lazy(() => import('./pages/ExamDates/ExamDatesPage'));
const PrepGuidePage = lazy(() => import('./pages/PrepGuide/PrepGuidePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicyPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboard/AdminDashboardPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminDashboard/AdminLoginPage'));
const AdminPaymentsPage = lazy(() => import('./pages/AdminPanel/AdminPaymentsPage'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

const AdminLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0c1929' }}>
    <div style={{ width: 40, height: 40, border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '14px',
            borderRadius: '8px',
          },
        }} 
      />
      <Routes>
      {/* ── Admin routes (outside MainLayout — no public navbar/footer) ── */}
      <Route path="/admin/login" element={
        <Suspense fallback={<AdminLoader />}>
          <AdminLoginPage />
        </Suspense>
      } />
      <Route path="/admin" element={
        <Suspense fallback={<AdminLoader />}>
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        </Suspense>
      } />
      <Route path="/admin/approvals" element={
        <Suspense fallback={<AdminLoader />}>
          <AdminProtectedRoute>
            <AdminPaymentsPage />
          </AdminProtectedRoute>
        </Suspense>
      } />

      {/* ── School Panel (outside MainLayout) ── */}
      <Route path={ROUTES.schoolPanel} element={
        <Suspense fallback={<AdminLoader />}>
          <ErrorBoundary>
            <SchoolPanelPage />
          </ErrorBoundary>
        </Suspense>
      } />

      {/* ── Public routes (inside MainLayout with navbar/footer) ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/marking-scheme" element={<MarkingScheme />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/syllabus-pyqs" element={
          <SyllabusPYQs 
            onSelectSyllabus={(subjectSlug) => {
              navigate(ROUTES.syllabusDetail(subjectSlug));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        } />
        <Route path="/syllabus/:subjectSlug" element={
          <SyllabusDetail 
            onBack={() => {
              navigate(ROUTES.syllabusPyqs);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onMarkingSchemeClick={() => {
              navigate(ROUTES.markingScheme);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        } />
        <Route path="/syllabus/:subjectSlug/:classSlug" element={<SyllabusClassPage />} />
        <Route path="/previous-year" element={<PreviousYearPage />} />
        <Route path="/previous-year/:subjectSlug" element={<SubjectPreviousYearPage />} />
        <Route path="/previous-year/:subjectSlug/:classSlug/:year" element={<PreviousYearDetailPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/subject-rankers" element={
          <SubjectRankersPage 
            onSelectSubject={(subjectName) => {
              navigate(ROUTES.rankersList(subjectName));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        } />
        <Route path="/rankers-list/:subjectName" element={
          <RankersListPage 
            onBack={() => {
              navigate(ROUTES.subjectRankers);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        } />
        <Route path="/login" element={
          <LoginPage 
            onSignUp={() => { 
              navigate(ROUTES.register); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }} 
          />
        } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/exam-dates" element={<ExamDatesPage />} />
        <Route path="/prep-guide" element={<PrepGuidePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
      </Routes>
    </>
  );
}

export default App;

