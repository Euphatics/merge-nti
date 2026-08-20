/**
 * Centralized route definitions.
 * Use these builders instead of hardcoding paths in components.
 */

export const ROUTES = {
  home: '/',
  contact: '/contact',
  faq: '/faq',
  examDates: '/exam-dates',
  gallery: '/gallery',
  markingScheme: '/marking-scheme',
  awards: '/awards',
  results: '/results',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  schoolPanel: '/school-panel',
  prepGuide: '/prep-guide',
  adminDashboard: '/admin',
  adminLogin: '/admin/login',
  adminApprovals: '/admin/approvals',

  // Syllabus
  syllabusPyqs: '/syllabus-pyqs',
  syllabusDetail: (subjectSlug) => `/syllabus/${subjectSlug}`,
  syllabusClass: (subjectSlug, classSlug) =>
    `/syllabus/${subjectSlug}/${classSlug}`,

  // Previous Year Papers
  previousYear: '/previous-year',
  subjectPreviousYear: (subjectSlug) => `/previous-year/${subjectSlug}`,
  previousYearDetail: (subjectSlug, classSlug, year) =>
    `/previous-year/${subjectSlug}/${classSlug}/${year}`,

  // Rankers
  subjectRankers: '/subject-rankers',
  rankersList: (subjectName) =>
    `/rankers-list/${encodeURIComponent(subjectName)}`,
};

/** Base URL used for canonical links and OG tags */
export const BASE_URL = 'https://ntiolympiad.in';
