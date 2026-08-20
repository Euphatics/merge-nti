import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { SUBJECTS } from '../../config/subjects';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/results`);
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Get unique years from results
  const years = [...new Set(results.map(r => r.year))].sort((a, b) => b - a);
  
  // Filter results
  const filteredResults = results.filter(r => {
    if (selectedSubject && r.subjectSlug !== selectedSubject) return false;
    if (selectedYear && r.year.toString() !== selectedYear) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 font-['Inter',sans-serif]">
      <Helmet>
        <title>Examination Results - NTI Olympiad</title>
        <meta name="description" content="View and download NTI Olympiad examination results for Mathematics, Science, English, IT, and Finance." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Examination Results</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-[15px]">
            Download the official result sheets for the NTI Olympiad. Use the filters below to find the results for your specific subject and year.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map(s => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by Year</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Years</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-end md:justify-start">
            <button 
              onClick={() => { setSelectedSubject(''); setSelectedYear(''); }}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center justify-center gap-3">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm">There are currently no results available for the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => {
              const subject = SUBJECTS.find(s => s.slug === result.subjectSlug);
              return (
                <div key={result.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col">
                  {/* Decorative top bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                  
                  <div className="flex items-start gap-4 mb-5 flex-1">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                      <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-1">
                        {subject ? subject.name : result.subjectSlug}
                      </h3>
                      <p className="text-[13px] text-gray-500 font-medium">
                        Class {result.classSlug.replace('class-', '')} • {result.year}
                      </p>
                    </div>
                  </div>
                  
                  <a 
                    href={result.resultUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 font-semibold py-3 rounded-lg text-[13px] transition-colors border border-gray-200 hover:border-blue-600"
                  >
                    <Download size={16} />
                    View / Download Result
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
