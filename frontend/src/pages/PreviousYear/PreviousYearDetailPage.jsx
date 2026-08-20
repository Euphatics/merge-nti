import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Download, FileText, Printer } from 'lucide-react';
import { getSubjectBySlug, getClassBySlug, CLASS_LEVELS } from '../../config/subjects';
import { syllabusData } from '../../data/syllabusData';
import { ROUTES } from '../../config/routes';
import { Breadcrumb, PageContainer, Button, SectionHeading } from '../../components/ui';
import { api } from '../../config/api';

const getSampleQuestions = (subjectSlug, classSlug) => {
  const label = classSlug ? classSlug.toUpperCase().replace('-', ' ') : 'CLASS';
  switch (subjectSlug) {
    case 'science':
      return [
        {
          q: `[Science - ${label}] Which organ in the human body is primarily responsible for pumping blood?`,
          options: ['A) Lungs', 'B) Brain', 'C) Heart', 'D) Liver'],
          ans: 'C'
        },
        {
          q: 'What state of matter has a definite volume but no definite shape?',
          options: ['A) Solid', 'B) Liquid', 'C) Gas', 'D) Plasma'],
          ans: 'B'
        },
        {
          q: 'Which planet in our solar system is closest to the Sun?',
          options: ['A) Venus', 'B) Mars', 'C) Mercury', 'D) Earth'],
          ans: 'C'
        }
      ];
    case 'english':
      return [
        {
          q: `[English - ${label}] Choose the correct spelling:`,
          options: ['A) Recieve', 'B) Receive', 'C) Receve', 'D) Recive'],
          ans: 'B'
        },
        {
          q: "Identify the synonym of 'Ancient':",
          options: ['A) Modern', 'B) Old', 'C) Fast', 'D) New'],
          ans: 'B'
        },
        {
          q: 'Fill in the blank: "Neither of the options ___ correct."',
          options: ['A) is', 'B) are', 'C) were', 'D) be'],
          ans: 'A'
        }
      ];
    case 'information-technology':
      return [
        {
          q: `[IT - ${label}] What does CPU stand for?`,
          options: ['A) Central Process Unit', 'B) Computer Processing Unit', 'C) Central Processing Unit', 'D) Control Processing Unit'],
          ans: 'C'
        },
        {
          q: 'Which of the following is an input device?',
          options: ['A) Monitor', 'B) Printer', 'C) Keyboard', 'D) Speaker'],
          ans: 'C'
        },
        {
          q: 'What is the binary representation of the decimal number 5?',
          options: ['A) 100', 'B) 101', 'C) 110', 'D) 111'],
          ans: 'B'
        }
      ];
    case 'finance':
      return [
        {
          q: `[Finance - ${label}] What is the primary purpose of a bank savings account?`,
          options: ['A) To buy stocks', 'B) To save money and earn interest', 'C) To pay tax', 'D) To loan money to others'],
          ans: 'B'
        },
        {
          q: 'What term refers to the money earned by investing capital?',
          options: ['A) Profit', 'B) Loss', 'C) Debit', 'D) Liability'],
          ans: 'A'
        },
        {
          q: 'What does GDP stand for?',
          options: ['A) General Domestic Product', 'B) Gross Domestic Product', 'C) Gross Development Product', 'D) General Development Product'],
          ans: 'B'
        }
      ];
    case 'mathematics':
    default:
      return [
        {
          q: `[Maths - ${label}] Find the next number in the pattern: 2, 5, 10, 17, ...`,
          options: ['A) 24', 'B) 26', 'C) 28', 'D) 30'],
          ans: 'B'
        },
        {
          q: 'A rectangular garden is 12m long and 8m wide. What is its perimeter?',
          options: ['A) 20m', 'B) 40m', 'C) 96m', 'D) 44m'],
          ans: 'B'
        },
        {
          q: 'If 3x + 7 = 22, what is the value of x?',
          options: ['A) 3', 'B) 5', 'C) 7', 'D) 9'],
          ans: 'B'
        }
      ];
  }
};

export default function PreviousYearDetailPage() {
  const { subjectSlug, classSlug, year } = useParams();
  const [publishedPyq, setPublishedPyq] = useState(null);

  const subject = getSubjectBySlug(subjectSlug);
  const classLevel = getClassBySlug(classSlug);

  useEffect(() => {
    if (!subjectSlug || !classSlug) return;

    let active = true;

    // Filtering happens server-side rather than fetching every paper and
    // scanning the list in the browser.
    const params = new URLSearchParams({ subjectSlug, classSlug });
    if (year) params.set('year', year);

    api
      .get(`/api/pyqs?${params}`)
      .then((data) => {
        if (!active) return;
        const papers = data.pyqs ?? [];
        setPublishedPyq(papers.find((p) => p.type === 'Question Paper') ?? papers[0] ?? null);
      })
      .catch(() => {
        // The page still renders its static syllabus and sample questions; only
        // the download link is unavailable.
        if (active) setPublishedPyq(null);
      });

    return () => {
      active = false;
    };
  }, [subjectSlug, classSlug, year]);

  if (!subject || !classLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-none max-w-sm text-left">
          <h1 className="text-xl font-medium text-gray-800 mb-2">Resource Not Found</h1>
          <p className="text-gray-500 text-sm mb-4">The past paper details you are looking for could not be found.</p>
          <Link to={ROUTES.previousYear} className="text-[#007BFF] hover:underline font-medium">
            Back to All Subjects
          </Link>
        </div>
      </div>
    );
  }

  const classSyllabus = syllabusData[subjectSlug]?.[classSlug];
  const topics = classSyllabus?.sections?.syllabus?.content || [];
  const questions = getSampleQuestions(subjectSlug, classSlug);

  const pdfUrl = publishedPyq?.paperUrl;

  const handleDownload = (type) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    let textContent = `========================================================================
                 NTI OLYMPIAD OFFICIAL PRACTICE PAPER (${type})
========================================================================
Subject: NTI ${subject.name} (${subject.abbr})
Grade Level: ${classLevel.name}
Practice Paper Year: ${year}
Document Type: ${type}
Total Marks: 100
Time Allowed: 60 Minutes

------------------------------------------------------------------------
Syllabus Topics Covered:
${topics.length > 0 ? topics.map(t => `- ${t}`).join('\n') : '- Basic syllabus conceptual curriculum'}

------------------------------------------------------------------------
Questions:
${questions.map((q, i) => `Q${i + 1}. ${q.q}\n${q.options.join('\n')}\n${type === 'Answer Key' ? `Correct Answer: ${q.ans}\n` : ''}`).join('\n\n')}

========================================================================
                 NTI OLYMPIAD - PRACTICE MAKES PERFECT
========================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NTI_${subject.abbr}_${classLevel.name.replace(/\s+/g, '_')}_PYQ_${year}_${type.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <Helmet>
        <title>{`NTI ${subject.abbr} Previous Year Paper - ${classLevel.name}`}</title>
        <meta name="description" content={`Access NTI ${subject.name} (${subject.abbr}) previous year question paper for ${classLevel.name} of year ${year}.`} />
        <link rel="canonical" href={`https://ntiolympiad.in/previous-year/${subject.slug}/${classLevel.slug}/${year}`} />
      </Helmet>

      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Previous Year Papers', path: ROUTES.previousYear },
        { label: `${subject.abbr} Papers`, path: ROUTES.subjectPreviousYear(subject.slug) },
        { label: `${classLevel.name} Paper (${year})` }
      ]} />

      <PageContainer className="py-8">
        {/* Header */}
        <div className="w-full border-b border-gray-300 pb-4 mb-8 text-left">
          <SectionHeading level="h1" className="font-normal text-gray-900">
            NTI {subject.abbr} Previous Year Paper - {classLevel.name}
          </SectionHeading>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left">
          
          {/* Main PDF Viewer and Actions column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Real PDF Viewer Container */}
            <div className="border-2 border-gray-300 rounded-none overflow-hidden shadow-sm bg-gray-50 flex flex-col">
              
              {/* PDF Header bar */}
              <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b-2 border-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-none bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    PDF
                  </div>
                  <span className="text-[13px] font-semibold text-gray-800 truncate max-w-xs sm:max-w-md">
                    NTI_{subject.abbr}_{classLevel.name.replace(/\s+/g, '_')}_PYQ_{year}.pdf
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-blue-300 px-2.5 py-1 rounded-none flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Open Fullscreen
                    </a>
                  )}
                  <div className="text-[12px] font-semibold text-gray-600 bg-white border border-gray-300 px-2 py-0.5 rounded-none">
                    Year {year}
                  </div>
                </div>
              </div>

              {/* PDF Viewer Sheet */}
              <div className="bg-white border-b-2 border-gray-300 min-h-[450px]">
                {pdfUrl ? (
                  <div className="relative w-full h-[650px]">
                    <object
                      data={`${pdfUrl}#toolbar=1`}
                      type="application/pdf"
                      className="w-full h-full"
                    >
                      <iframe
                        src={`${pdfUrl}#toolbar=1`}
                        className="w-full h-full border-0"
                        title={`NTI ${subject.abbr} PYQ ${year}`}
                      >
                        <div className="p-8 text-center text-gray-600">
                          <p className="mb-4 text-sm font-semibold">Your browser does not support inline PDF viewing.</p>
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold inline-flex items-center gap-2"
                          >
                            <Download size={14} /> Download PDF Document
                          </a>
                        </div>
                      </iframe>
                    </object>
                  </div>
                ) : (
                  /* Interactive PDF Practice Paper Renderer Fallback */
                  <div className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto custom-scroll font-serif leading-relaxed text-sm text-gray-800">
                    <div className="text-center border-b-2 border-double border-gray-300 pb-4 mb-6">
                      <h3 className="text-lg font-bold uppercase text-gray-900 tracking-wide">
                        National Testing Initiative
                      </h3>
                      <p className="text-xs uppercase text-gray-500 tracking-wider mt-0.5">
                        {subject.name} Olympiad ({subject.abbr}) &bull; {classLevel.name}
                      </p>
                      <p className="text-xs font-semibold text-gray-600 mt-1">
                        Previous Year Practice Sheet &bull; Academic Year {year}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-sans text-gray-600 bg-gray-50 p-3.5 rounded mb-6 border border-gray-200">
                      <div><strong>Time Allowed:</strong> 60 Minutes</div>
                      <div><strong>Total Questions:</strong> 50 Questions</div>
                      <div><strong>Total Marks:</strong> 100 Marks</div>
                      <div><strong>Negative Marking:</strong> None</div>
                    </div>

                    {topics.length > 0 && (
                      <div className="mb-6 font-sans text-[13px]">
                        <h4 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1 uppercase tracking-wider text-[11px]">
                          Assessed Syllabus Topics
                        </h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-gray-600">
                          {topics.map((t, index) => (
                            <span key={index} className="flex items-center gap-1">
                              &bull; {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-6 font-sans">
                      <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[12px] border-b border-gray-200 pb-1">
                        Section A — Conceptual Understanding & Problem Solving
                      </h4>
                      {questions.map((q, i) => (
                        <div key={i} className="space-y-2">
                          <p className="font-semibold text-gray-950 text-[14px]">
                            Q{i + 1}. {q.q}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3">
                            {q.options.map((opt, idx) => (
                              <div key={idx} className="text-gray-700 text-[13.5px]">
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Centered / Left Download Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="secondary"
                onClick={() => handleDownload('Question Paper')}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                {pdfUrl ? 'Download Question Paper PDF' : 'Download Question Paper'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleDownload('Answer Key')}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                Download Answer Key & Solutions
              </Button>
              {!pdfUrl && (
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-none hover:bg-gray-50 text-[13px] flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={15} /> Print Practice Sheet
                </button>
              )}
            </div>

          </div>

          {/* Related Links column */}
          <div className="space-y-6">
            <div className="border-2 border-gray-300 rounded-none p-5 bg-gray-50/50 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider border-b-2 border-gray-300 pb-2">
                Related Links
              </h2>
              <ul className="space-y-3.5 text-[14px]">
                <li>
                  <Link
                    to={ROUTES.syllabusClass(subject.slug, classLevel.slug)}
                    className="text-[#007BFF] hover:underline flex items-center gap-1.5 font-medium"
                  >
                    &raquo; View Syllabus
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => handleDownload('Answer Key')}
                    className="text-[#007BFF] hover:underline flex items-center gap-1.5 font-medium cursor-pointer text-left w-full"
                  >
                    &raquo; Download Answer Key
                  </button>
                </li>
                <li>
                  <Link
                    to={ROUTES.subjectRankers}
                    className="text-[#007BFF] hover:underline flex items-center gap-1.5 font-medium"
                  >
                    &raquo; Exam Results & Rankers
                  </Link>
                </li>
                <li className="pt-2 border-t-2 border-gray-300">
                  <span className="text-xs text-gray-500 font-semibold uppercase block mb-2">
                    Other Grade Levels
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CLASS_LEVELS.filter((c) => c.slug !== classLevel.slug).map((c) => (
                      <Link
                        key={c.slug}
                        to={ROUTES.previousYearDetail(subject.slug, c.slug, year)}
                        className="text-[12.5px] text-[#007BFF] hover:underline font-medium block"
                      >
                        &bull; {c.name}
                      </Link>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  );
}
