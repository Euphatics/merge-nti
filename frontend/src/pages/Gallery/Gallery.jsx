import { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { API_BASE_URL } from '../../config/api';
import Skeleton from '../../components/Skeleton';

export default function Gallery() {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null); // null = grid view, number = viewer
  const viewerRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          setGalleryData(data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery images', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (activeIndex !== null && viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeIndex]);

  // Keyboard navigation (only when viewer is open)
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') {
      setActiveIndex(null);
    } else if (e.key === 'ArrowRight') {
      setActiveIndex((i) => (i !== null && galleryData.length > 0 ? (i + 1) % galleryData.length : null));
    } else if (e.key === 'ArrowLeft') {
      setActiveIndex((i) => (i !== null && galleryData.length > 0 ? (i - 1 + galleryData.length) % galleryData.length : null));
    }
  }, [galleryData]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const goPrev = () => setActiveIndex((i) => (i !== null && galleryData.length > 0 ? (i - 1 + galleryData.length) % galleryData.length : null));
  const goNext = () => setActiveIndex((i) => (i !== null && galleryData.length > 0 ? (i + 1) % galleryData.length : null));
  const closeViewer = () => setActiveIndex(null);

  const current = activeIndex !== null ? galleryData[activeIndex] : null;
  const ogImage = galleryData.length > 0 ? `${API_BASE_URL}${galleryData[0].image}` : "https://ntiolympiad.in/about_nti_banner.png";

  return (
    <section className="w-full bg-[#f9fafb] py-8 lg:py-12" aria-labelledby="gallery-heading">
      <Helmet>
        <title>Gallery & Moments – NTI Olympiad</title>
        <meta name="description" content="View photos and highlights from NTI Olympiad award ceremonies, events, and student achievements." />
        <link rel="canonical" href="https://ntiolympiad.in/gallery" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gallery & Moments – NTI Olympiad" />
        <meta property="og:description" content="View photos and highlights from NTI Olympiad award ceremonies, events, and student achievements." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://ntiolympiad.in/gallery" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gallery & Moments – NTI Olympiad" />
        <meta name="twitter:description" content="View photos and highlights from NTI Olympiad award ceremonies, events, and student achievements." />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <h1 ref={viewerRef} id="gallery-heading" className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1 scroll-mt-24">
          NTI Awards Gallery
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-[#007BFF] to-transparent mb-16"></div>

        {/* ─── Viewer (only when a photo is clicked) ─── */}
        {current && (
          <div className="mb-10 relative">
            {/* Close button */}
            <button
              onClick={closeViewer}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#414a48] hover:opacity-90 flex items-center justify-center text-white transition-opacity cursor-pointer shadow-lg"
              aria-label="Close viewer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 sm:gap-8">
              {/* Left Arrow */}
              <button
                onClick={goPrev}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors cursor-pointer shadow-md hidden sm:flex"
                aria-label="Previous photo"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Photo + Info */}
              <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
                {/* Selected Photo */}
                <div className="flex-shrink-0 w-full sm:w-[480px] rounded-xl overflow-hidden border-[3px] border-[#007BFF] shadow-lg relative group">
                  <img
                    src={`${API_BASE_URL}${current.image}`}
                    alt={`${current.name} – ${current.school}`}
                    className="w-full h-[350px] sm:h-[450px] object-cover"
                  />
                  {/* Mobile navigation arrows overlaid on image */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 sm:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={goPrev} className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={goNext} className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center py-4 sm:py-10">
                  <div className="space-y-5">
                    <p className="text-base lg:text-lg text-gray-800">
                      <span className="font-bold">Name : </span>
                      <span className="text-gray-700">{current.name}</span>
                    </p>
                    <p className="text-base lg:text-lg text-gray-800">
                      <span className="font-bold">School : </span>
                      <span className="text-gray-700">{current.school}</span>
                    </p>
                    <p className="text-base lg:text-lg text-gray-800">
                      <span className="font-bold">Class : </span>
                      <span className="text-[#007BFF] font-semibold">{current.className}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={goNext}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors cursor-pointer shadow-md hidden sm:flex"
                aria-label="Next photo"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px]">
                <Skeleton width="100%" height="100%" borderRadius="0.5rem" />
              </div>
            ))}
          </div>
        ) : galleryData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No Photos Yet</h3>
            <p className="text-gray-500 mt-2">Check back later for photos from our latest events and award ceremonies!</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            {galleryData.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => setActiveIndex(i)}
                className={`w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px] overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 ${
                  i === activeIndex
                    ? 'border-[#007BFF] shadow-lg scale-[1.03]'
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <img
                  src={`${API_BASE_URL}${photo.image}`}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
