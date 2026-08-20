import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-[#00b0ff] rounded-full animate-spin"></div>
  </div>
);

export default function MainLayout({ onSelect }) {
  const { pathname } = useLocation();

  // Scroll to top on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar onSelect={onSelect} />

      {/* Spacer for fixed navbar */}
      <div className="pt-16">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
