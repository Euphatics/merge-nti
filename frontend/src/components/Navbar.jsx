import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SUBJECTS, CLASS_LEVELS as CLASS_LEVELS_CONFIG, OLYMPIAD_CATEGORIES } from '../config/subjects';
import { ROUTES } from '../config/routes';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
// OLYMPIAD_CATEGORIES and CLASS_LEVELS now imported from config/subjects.js
const CLASS_LEVELS = CLASS_LEVELS_CONFIG.map((c) => c.name);

/** Map subject category name → slug for route building */
const getSubjectSlug = (categoryName) => {
  const subject = SUBJECTS.find((s) => s.name === categoryName);
  return subject ? subject.slug : '';
};

/** Convert class name like 'Class 1' to 'class-1' */
const toClassSlug = (className) => className.toLowerCase().replace(/ /g, '-');

const FAQ_ITEMS = [
  'FAQs',
  'Exam Dates',
  'Exam Syllabus and PYQs',
  'Marking Scheme',
  'Awards & Recognition',
  'Subject Rankers',
  'Contact Us',
];

const getFAQItemPath = (item) => {
  if (item === 'FAQs') return '/faq';
  if (item === 'Exam Dates') return '/exam-dates';
  if (item === 'Exam Syllabus and PYQs') return '/syllabus-pyqs';
  if (item === 'Marking Scheme') return '/marking-scheme';
  if (item === 'Awards & Recognition') return '/awards';
  if (item === 'Subject Rankers') return '/subject-rankers';
  if (item === 'Contact Us') return '/contact';
  return '#';
};

const PREPARATION_ITEMS = ['PYQs', 'Prep Books', 'Prep Guide'];

/* ═══════════════════════════════════════════════════════════════
   NAVBAR COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Navbar({ onSelect = () => { } }) {
  /* ── State ──────────────────────────────────────────────── */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDD, setActiveDD] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [mobAccordion, setMobAccordion] = useState(null);
  const [mobSubAccordion, setMobSubAccordion] = useState(null);

  const navRef = useRef(null);
  const closeRef = useRef(null);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Optionally call backend logout endpoint here if needed
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    navigate('/login');
  };

  /* ── Click-outside to close desktop dropdown ───────────── */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDD(null);
        setHoveredCat(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Escape key ────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setActiveDD(null);
        setHoveredCat(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* ── Lock body scroll when mobile drawer is open ───────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /* ── Handlers ──────────────────────────────────────────── */
  const enterDD = useCallback((name) => {
    clearTimeout(closeRef.current);
    setActiveDD(name);
    if (name !== 'olympiads') setHoveredCat(null);
  }, []);

  const leaveDD = useCallback(() => {
    closeRef.current = setTimeout(() => {
      setActiveDD(null);
      setHoveredCat(null);
    }, 200);
  }, []);

  const select = useCallback(
    (category, item) => {
      onSelect(category, item);
      setActiveDD(null);
      setHoveredCat(null);
      setMobileOpen(false);
      setMobAccordion(null);
      setMobSubAccordion(null);
    },
    [onSelect],
  );

  const toggleMobAcc = (name) => {
    setMobAccordion((p) => (p === name ? null : name));
    setMobSubAccordion(null);
  };

  const toggleMobSub = (name) => {
    setMobSubAccordion((p) => (p === name ? null : name));
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ─── TOP BAR ──────────────────────────────────────── */}
      <nav
        ref={navRef}
        id="navbar"
        className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            {/* ─── LOGO ─── */}
            <Link
              to="/"
              id="nav-logo"
              className="flex items-center gap-2.5 select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-700 to-royal-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-royal-800">NTI</span>
                <span className="text-gray-500 font-semibold ml-1">
                  Olympiad
                </span>
              </span>
            </Link>

            {/* ─── DESKTOP NAV ─── */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Olympiads */}
              <div
                className="relative"
                onMouseEnter={() => enterDD('olympiads')}
                onMouseLeave={leaveDD}
              >
                <button
                  id="nav-olympiads"
                  onClick={() =>
                    setActiveDD((p) => (p === 'olympiads' ? null : 'olympiads'))
                  }
                  className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-colors duration-200 ${activeDD === 'olympiads'
                    ? 'text-royal-800'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Olympiads
                  <ChevronDown
                    size={15}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${activeDD === 'olympiads' ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Olympiad Dropdown Panel */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 origin-top ${activeDD === 'olympiads' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                  }`}>
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-900/8 py-1.5 min-w-[280px]">
                    {/* Royal accent bar */}
                    <div className="h-[2.5px] bg-gradient-to-r from-royal-600 to-royal-800 mx-3 rounded-full mb-1.5" />

                    {OLYMPIAD_CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        className="relative"
                        onMouseEnter={() => setHoveredCat(cat)}
                      >
                        <button
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${hoveredCat === cat
                            ? 'bg-royal-50 text-royal-800'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <span>{cat}</span>
                          <ChevronRight
                            size={14}
                            strokeWidth={2.5}
                            className={`transition-colors duration-150 ${hoveredCat === cat
                              ? 'text-royal-600'
                              : 'text-gray-300'
                              }`}
                          />
                        </button>

                        {/* Class-level flyout */}
                        <div className={`absolute left-full top-0 ml-1.5 z-50 transition-all duration-200 origin-left ${hoveredCat === cat ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                          }`}>
                          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-900/8 py-1.5 min-w-[180px] max-h-[380px] overflow-y-auto custom-scroll">
                            {CLASS_LEVELS.map((cls) => {
                              const classSlug = toClassSlug(cls);
                              const subjectSlug = getSubjectSlug(cat);
                              return (
                                <Link
                                  key={cls}
                                  to={ROUTES.syllabusClass(subjectSlug, classSlug)}
                                  onClick={() => {
                                    select(cat, cls);
                                  }}
                                  className="w-full text-left px-4 py-2 text-[13px] text-gray-600 font-medium hover:bg-royal-50 hover:text-royal-800 transition-colors duration-150 block"
                                >
                                  {cls}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div
                className="relative"
                onMouseEnter={() => enterDD('faqs')}
                onMouseLeave={leaveDD}
              >
                <button
                  id="nav-faqs"
                  onClick={() =>
                    setActiveDD((p) => (p === 'faqs' ? null : 'faqs'))
                  }
                  className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-colors duration-200 ${activeDD === 'faqs'
                    ? 'text-royal-800'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  FAQs
                  <ChevronDown
                    size={15}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${activeDD === 'faqs' ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 origin-top ${activeDD === 'faqs' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                  }`}>
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-900/8 py-1.5 min-w-[230px]">
                    <div className="h-[2.5px] bg-gradient-to-r from-royal-600 to-royal-800 mx-3 rounded-full mb-1.5" />
                    {FAQ_ITEMS.map((item) => (
                      <Link
                        key={item}
                        to={getFAQItemPath(item)}
                        onClick={() => select('FAQs', item)}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-royal-50 hover:text-royal-800 transition-colors duration-150 block"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preparations */}
              <div
                className="relative"
                onMouseEnter={() => enterDD('preparations')}
                onMouseLeave={leaveDD}
              >
                <button
                  id="nav-preparations"
                  onClick={() =>
                    setActiveDD((p) =>
                      p === 'preparations' ? null : 'preparations',
                    )
                  }
                  className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-colors duration-200 ${activeDD === 'preparations'
                    ? 'text-royal-800'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Preparations
                  <ChevronDown
                    size={15}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${activeDD === 'preparations' ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 origin-top ${activeDD === 'preparations' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                  }`}>
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-900/8 py-1.5 min-w-[190px]">
                    <div className="h-[2.5px] bg-gradient-to-r from-royal-600 to-royal-800 mx-3 rounded-full mb-1.5" />
                    {PREPARATION_ITEMS.map((item) => {
                      const itemPath = item === 'PYQs' ? ROUTES.previousYear : item === 'Prep Guide' ? ROUTES.prepGuide : item === 'Prep Books' ? ROUTES.awards : '#';
                      return (
                        <Link
                          key={item}
                          to={itemPath}
                          onClick={() => select('Preparations', item)}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-royal-50 hover:text-royal-800 transition-colors duration-150 block"
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <Link
                id="nav-gallery"
                to="/gallery"
                onClick={() => select('Gallery', 'Gallery')}
                className="py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Gallery
              </Link>

              {/* Results */}
              <Link
                id="nav-results"
                to="/results"
                onClick={() => select('Results', 'Results')}
                className="py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Results
              </Link>
            </div>

            {/* ─── DESKTOP AUTH BUTTONS ─── */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/school-panel"
                    className="cursor-pointer px-6 py-2 text-[15px] font-medium text-white bg-[#007BFF] rounded-[4px] hover:bg-[#0069D9] transition-all duration-200 flex items-center justify-center"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer px-6 py-2 text-[15px] font-medium text-gray-700 bg-white border border-[#007BFF] rounded-[4px] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    id="btn-login-desktop"
                    to="/login"
                    onClick={() => select('Login', 'Login')}
                    className="cursor-pointer px-6 py-2 text-[15px] font-medium text-gray-700 bg-white border border-[#007BFF] rounded-[4px] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                  >
                    Log In
                  </Link>
                  <Link
                    id="btn-register-desktop"
                    to="/register"
                    onClick={() => select('Register', 'Register')}
                    className="cursor-pointer px-6 py-2 text-[15px] font-medium text-white bg-[#007BFF] rounded-[4px] hover:bg-[#0069D9] transition-all duration-200 flex items-center justify-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* ─── MOBILE HAMBURGER ─── */}
            <button
              id="btn-mobile-menu"
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
         MOBILE DRAWER
         ═══════════════════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] w-full max-w-[380px] bg-white shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-700 to-royal-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-royal-800">NTI</span>
              <span className="text-gray-500 font-semibold ml-1">
                Olympiad
              </span>
            </span>
          </Link>
          <button
            id="btn-close-mobile"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 custom-scroll">
          {/* ── Olympiads Accordion ── */}
          <div>
            <button
              onClick={() => toggleMobAcc('olympiads')}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mobAccordion === 'olympiads'
                ? 'text-royal-800 bg-royal-50'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Olympiads
              <ChevronDown
                size={16}
                strokeWidth={2.5}
                className={`transition-transform duration-300 ${mobAccordion === 'olympiads' ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${mobAccordion === 'olympiads' ? 'max-h-[800px] opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}>
              <div className="ml-3 border-l-2 border-royal-100 pl-2 space-y-0.5 pb-2">
                {OLYMPIAD_CATEGORIES.map((cat) => (
                  <div key={cat}>
                    <button
                      onClick={() => toggleMobSub(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 ${mobSubAccordion === cat
                        ? 'text-royal-800 bg-royal-50 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                        }`}
                    >
                      {cat}
                      <ChevronRight
                        size={14}
                        strokeWidth={2.5}
                        className={`transition-transform duration-200 ${mobSubAccordion === cat ? 'rotate-90' : ''
                          }`}
                      />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${mobSubAccordion === cat ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      <div className="ml-3 border-l-2 border-royal-100 pl-2 py-1 space-y-0.5">
                        {CLASS_LEVELS.map((cls) => {
                          const classSlug = toClassSlug(cls);
                          const subjectSlug = getSubjectSlug(cat);
                          return (
                            <Link
                              key={cls}
                              to={ROUTES.syllabusClass(subjectSlug, classSlug)}
                              onClick={() => {
                                select(cat, cls);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-royal-50 hover:text-royal-800 transition-colors duration-150 block"
                            >
                              {cls}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Preparations Accordion ── */}
          <div>
            <button
              onClick={() => toggleMobAcc('preparations')}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mobAccordion === 'preparations'
                ? 'text-royal-800 bg-royal-50'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Preparations
              <ChevronDown
                size={16}
                strokeWidth={2.5}
                className={`transition-transform duration-300 ${mobAccordion === 'preparations' ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${mobAccordion === 'preparations' ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}>
              <div className="ml-3 border-l-2 border-royal-100 pl-2 space-y-0.5 pb-2">
                {PREPARATION_ITEMS.map((item) => {
                  const itemPath = item === 'PYQs' ? ROUTES.previousYear : item === 'Prep Guide' ? ROUTES.prepGuide : item === 'Prep Books' ? ROUTES.awards : '#';
                  return (
                    <Link
                      key={item}
                      to={itemPath}
                      onClick={() => select('Preparations', item)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-royal-50 hover:text-royal-800 transition-colors duration-150 block"
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── FAQs Accordion ── */}
          <div>
            <button
              onClick={() => toggleMobAcc('faqs')}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mobAccordion === 'faqs'
                ? 'text-royal-800 bg-royal-50'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              FAQs
              <ChevronDown
                size={16}
                strokeWidth={2.5}
                className={`transition-transform duration-300 ${mobAccordion === 'faqs' ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${mobAccordion === 'faqs' ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}>
              <div className="ml-3 border-l-2 border-royal-100 pl-2 space-y-0.5 pb-2">
                {FAQ_ITEMS.map((item) => (
                  <Link
                    key={item}
                    to={getFAQItemPath(item)}
                    onClick={() => select('FAQs', item)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-royal-50 hover:text-royal-800 transition-colors duration-150 block"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Gallery ── */}
          <Link
            to="/gallery"
            onClick={() => select('Gallery', 'Gallery')}
            className="w-full text-left block px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Gallery
          </Link>

          {/* ── Results ── */}
          <Link
            to="/results"
            onClick={() => select('Results', 'Results')}
            className="w-full text-left block px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Results
          </Link>
        </div>

        {/* Footer Auth */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="cursor-pointer h-[42px] text-[15px] font-medium text-gray-700 bg-white border border-[#007BFF] rounded-[4px] hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Logout
                </button>
                <Link
                  to="/school-panel"
                  onClick={() => setMobileOpen(false)}
                  className="cursor-pointer h-[42px] text-[15px] font-medium text-white bg-[#007BFF] rounded-[4px] hover:bg-[#0069D9] transition flex items-center justify-center"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  id="btn-login-mobile"
                  to="/login"
                  onClick={() => select('Login', 'Login')}
                  className="cursor-pointer h-[42px] text-[15px] font-medium text-gray-700 bg-white border border-[#007BFF] rounded-[4px] hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Log In
                </Link>

                <Link
                  id="btn-register-mobile"
                  to="/register"
                  onClick={() => select('Register', 'Register')}
                  className="cursor-pointer h-[42px] text-[15px] font-medium text-white bg-[#007BFF] rounded-[4px] hover:bg-[#0069D9] transition flex items-center justify-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
