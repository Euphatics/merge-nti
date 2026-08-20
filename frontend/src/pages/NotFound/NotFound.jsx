import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 px-6 py-12 text-center font-sans relative overflow-hidden">
      <Helmet>
        <title>Page Not Found | NTI Olympiad</title>
        <meta name="description" content="The page you are looking for does not exist on NTI Olympiad." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://ntiolympiad.in/404" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Page Not Found | NTI Olympiad" />
        <meta property="og:description" content="The page you are looking for does not exist on NTI Olympiad." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content="https://ntiolympiad.in/404" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Page Not Found | NTI Olympiad" />
        <meta name="twitter:description" content="The page you are looking for does not exist on NTI Olympiad." />
        <meta name="twitter:image" content="https://ntiolympiad.in/about_nti_banner.png" />
      </Helmet>

      {/* Decorative blurry background circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated 404 Illustration/Badge */}
        <div className="relative mb-6">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-widest select-none filter drop-shadow-sm">
            404
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded shadow-md border border-blue-400">
            Page Not Found
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 max-w-md leading-tight">
          Oops! That Page Has Traveled Into Space.
        </h2>
        
        <p className="text-gray-500 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
          The link you followed might be broken, or the page may have been removed. Let's get you back on track for the NTI Olympiad!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-lg hover:shadow-blue-500/20 active:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out cursor-pointer"
          >
            Go back to Home
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out cursor-pointer"
          >
            Visit FAQ Center
          </Link>
        </div>
      </div>
    </div>
  );
}
