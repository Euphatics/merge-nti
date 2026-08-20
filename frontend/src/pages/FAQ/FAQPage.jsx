import React from 'react';
import { Info, ClipboardCheck, Monitor, Award, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/ui';

/* ── Icon map for category headers ── */
const categoryIcons = {
    general: Info,
    registration: ClipboardCheck,
    exam: Monitor,
    results: Award,
};

/* ── FAQ data organized by category ── */
const faqCategories = [
    {
        id: 'general',
        title: 'General Information',
        color: '#3B82F6',
        items: [
            {
                q: 'What is the NTI Olympiad all about?',
                a: 'The NTI Olympiad is an independently organized national examination that evaluates students across five distinct disciplines. It is built to identify and encourage analytical ability, subject clarity, and creative reasoning among young learners throughout India.',
            },
            {
                q: 'Who is eligible to take part?',
                a: 'Any student currently enrolled in Class 1 through Class 10 at a recognized Indian school may participate. There is no prerequisite score or prior qualification needed to sign up.',
            },
            {
                q: 'What disciplines does the Olympiad cover?',
                a: 'Five disciplines are available: Mathematics, Science, English, Information Technology, and Finance. Participants may enroll in as many subjects as they wish during a single examination cycle.',
            },
            {
                q: 'What time of year does the examination take place?',
                a: 'Examinations are scheduled during the December to February window each academic session — registration opens in December, students participate in January, and examinations are held in February. View the full schedule on our Exam Dates page.',
            },
            {
                q: 'Do all participants receive a certificate?',
                a: 'Every student who sits for the exam is awarded a certificate of participation. Outstanding performers are further recognized at the school, city, state, and national tiers with additional honours and merit awards.',
            },
        ],
    },
    {
        id: 'registration',
        title: 'Registration & Enrollment',
        color: '#10B981',
        items: [
            {
                q: 'What is the process to sign up?',
                a: 'Enrollment can be completed through the school coordinator using the group registration form, or students may sign up on their own via the NTI Olympiad portal. Payment confirmation finalizes the registration.',
            },
            {
                q: 'Is individual sign-up possible without school involvement?',
                a: 'Absolutely. Students whose institutions are not currently partnered with NTI may register independently. An examination venue in their locality will be allocated upon successful enrollment.',
            },
            {
                q: 'How much does it cost to register?',
                a: 'Fees differ based on the chosen subject and the class category of the student. Current pricing is listed in the Fees section of the portal. Group enrollments through schools may qualify for reduced rates.',
            },
            {
                q: 'Is there a cutoff date for enrollment?',
                a: 'Registration windows are published at the start of each cycle. Early sign-up is advised since examination center capacity is fixed. A late registration option with a surcharge may be offered depending on availability.',
            },
        ],
    },
    {
        id: 'exam',
        title: 'Exam Mode & Technical Requirements',
        color: '#8B5CF6',
        items: [
            {
                q: 'Can the test be taken from home or only at a center?',
                a: 'Both formats are supported. Schools may opt for a supervised pen-and-paper session at their premises, or choose the proctored online mode. The preference is indicated at the time of registration.',
            },
            {
                q: 'Which hardware works for the online format?',
                a: 'A desktop computer, laptop, or tablet running a current version of Chrome, Firefox, or Edge is sufficient. A reliable internet connection is required throughout the session. Smartphones are not supported for the examination.',
            },
            {
                q: 'How is the question paper structured?',
                a: 'Each paper follows a multiple-choice format with 40 to 50 questions. The time limit per subject is 60 minutes. Questions span factual recall, conceptual depth, and practical application across the syllabus.',
            },
            {
                q: 'Where can I find practice material?',
                a: 'Practice sets and archived question papers from earlier cycles are accessible on the subject-specific pages of the NTI portal. Printed workbooks can also be ordered through the website.',
            },
            {
                q: 'What if my connection drops during the online test?',
                a: 'The platform saves responses continuously in the background. If connectivity is lost, the student can log back in and pick up exactly where they stopped, provided they are still within the allotted time window. A dedicated helpline is active throughout the exam duration.',
            },
        ],
    },
    {
        id: 'results',
        title: 'Results & Awards',
        color: '#F59E0B',
        items: [
            {
                q: 'How soon are scores published?',
                a: 'Score reports are released within four to six weeks of the examination date. Each participant can view their outcome by entering their roll number on the results page of the NTI portal.',
            },
            {
                q: 'What recognition do top scorers receive?',
                a: 'High-ranking students are presented with gold, silver, and bronze medals along with certificates of distinction. Scholarship grants and monetary prizes are awarded to national, state, and city-level rankers during the annual awards function.',
            },
            {
                q: 'Is a full performance breakdown available?',
                a: 'Yes. Once results are out, every participant can access a comprehensive scorecard through their dashboard. It includes a subject-level and topic-level analysis that highlights strengths and areas for improvement.',
            },
        ],
    },
];

/* ── Helper to highlight search terms ── */
function HighlightText({ text, highlight }) {
    if (!highlight || !highlight.trim()) return <>{text}</>;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5 font-bold">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}

/* ── Single FAQ item ── */
function FAQItem({ item, searchQuery }) {
    const matchesSearch = searchQuery && (item.q.toLowerCase().includes(searchQuery) || item.a.toLowerCase().includes(searchQuery));
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [prevSearch, setPrevSearch] = React.useState(searchQuery);

    if (searchQuery !== prevSearch) {
        setPrevSearch(searchQuery);
        setIsCollapsed(!matchesSearch);
    }

    const isOpen = !isCollapsed;

    return (
        <div
            className="px-6 py-4 lg:px-6 lg:py-4 bg-[#fafafa] border border-gray-200 rounded-lg transition-all duration-200 hover:border-gray-300"
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between gap-3 text-left focus:outline-none py-1"
            >
                <h4 className="text-[15px] lg:text-[16px] font-medium text-gray-800 pr-4">
                    <HighlightText text={item.q} highlight={searchQuery} />
                </h4>
                <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className="flex-shrink-0 text-gray-400 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-2 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <p className="text-[14px] lg:text-[15px] text-gray-600 leading-relaxed font-medium pb-2 pt-1">
                        <HighlightText text={item.a} highlight={searchQuery} />
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ── Category section ── */
function FAQCategory({ category, searchQuery }) {
    // Filter items by search query
    const filteredItems = category.items.filter(
        (item) =>
            item.q.toLowerCase().includes(searchQuery) ||
            item.a.toLowerCase().includes(searchQuery)
    );

    if (searchQuery && filteredItems.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Category header */}
            <div
                className="w-full flex items-center gap-4 px-5 py-4 mb-4 rounded-xl border"
                style={{
                    backgroundColor: `${category.color}15`,
                    borderColor: `${category.color}30`
                }}
            >
                {categoryIcons[category.id] && React.createElement(categoryIcons[category.id], { size: 22, color: category.color, strokeWidth: 2.5 })}
                <h3 className="text-lg lg:text-xl font-bold tracking-wide text-gray-900">
                    {category.title}
                </h3>
            </div>

            {/* FAQ items */}
            <div className="overflow-hidden">
                <div className="flex flex-col gap-3">
                    {filteredItems.map((item, idx) => {
                        const key = `${category.id}-${idx}`;
                        return (
                            <FAQItem
                                key={key}
                                item={item}
                                searchQuery={searchQuery}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ── Main FAQ Component ── */
export default function FAQ() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const normalizedSearch = searchQuery.toLowerCase().trim();

    // Check if any results exist
    const hasResults = faqCategories.some((cat) =>
        cat.items.some(
            (item) =>
                item.q.toLowerCase().includes(normalizedSearch) ||
                item.a.toLowerCase().includes(normalizedSearch)
        )
    );

    return (
        <>
            <Breadcrumb items={[
                { label: 'Home', path: '/' },
                { label: 'Frequently Asked Questions' }
            ]} />
            <section className="w-full bg-[#f9fafb] py-8 lg:py-14 border-b border-gray-200">
                <Helmet>
                <title>Frequently Asked Questions – NTI Olympiad</title>
                <meta name="description" content="Find answers to common questions about NTI Olympiad registrations, marking schemes, syllabi, and student performance rankings." />
                <link rel="canonical" href="https://ntiolympiad.in/faq" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Frequently Asked Questions – NTI Olympiad" />
                <meta property="og:description" content="Find answers to common questions about NTI Olympiad registrations, marking schemes, syllabi, and student performance rankings." />
                <meta property="og:site_name" content="NTI Olympiad" />
                <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
                <meta property="og:url" content="https://ntiolympiad.in/faq" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Frequently Asked Questions – NTI Olympiad" />
                <meta name="twitter:description" content="Find answers to common questions about NTI Olympiad registrations, marking schemes, syllabi, and student performance rankings." />
                <meta name="twitter:image" content="https://ntiolympiad.in/about_nti_banner.png" />

                {/* FAQPage JSON-LD Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqCategories.flatMap(category =>
                            category.items.map(item => ({
                                "@type": "Question",
                                "name": item.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": item.a
                                }
                            }))
                        )
                    })}
                </script>
            </Helmet>
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">

                {/* ── FAQ Header ── */}
                <div className="text-center mb-8 lg:mb-10 max-w-7xl mx-auto">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="h-1 w-12 bg-[#007BFF] mt-2 rounded-full mx-auto"></div>
                    <p className="mt-3 text-sm lg:text-base text-gray-500 font-medium">
                        Have Questions? We&rsquo;re Here to Help
                    </p>
                </div>

                {/* ── Search Bar ── */}
                <div className="max-w-xl mx-auto mb-8 lg:mb-10">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                        >
                            <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
                            <line x1="11.5" y1="11.5" x2="16" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 lg:py-5 rounded-xl border border-gray-200 bg-white text-base font-medium text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF]"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                                style={{ border: 'none' }}
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <line x1="2" y1="2" x2="8" y2="8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="8" y1="2" x2="2" y2="8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── FAQ Categories ── */}
                {hasResults ? (
                    <div className="w-full flex flex-col gap-2">
                        {faqCategories.map((category) => (
                            <FAQCategory
                                key={category.id}
                                category={category}
                                searchQuery={normalizedSearch}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-400 text-sm font-medium">
                            No FAQs match &ldquo;{searchQuery}&rdquo;. Try a different search term.
                        </p>
                    </div>
                )}

                {/* ── Still Need Help? ── */}
                <div
                    className="mt-10 lg:mt-12 bg-white border border-gray-200/80 rounded-2xl px-6 py-7 lg:px-10 lg:py-8 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-sm w-full"
                >
                    <div className="flex items-center gap-4">
                        <Phone size={24} color="#007BFF" strokeWidth={1.8} />
                        <div>
                            <h4 className="text-base lg:text-lg font-bold text-gray-800">
                                Still Need Help?
                            </h4>
                            <p className="text-xs lg:text-sm text-gray-500 font-medium mt-0.5">
                                Our support team is ready to assist you
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                        {/* Email */}
                        <a
                            href="mailto:support@ntiolympiad.org"
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#007BFF] transition-colors duration-200"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                <path d="M1 5l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            support@ntiolympiad.org
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:+91XXXXXXXXXX"
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#007BFF] transition-colors duration-200"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 2H4a2 2 0 00-2 2v1a9 9 0 009 9h1a2 2 0 002-2v-2l-3-1.5-1.5 1.5a5 5 0 01-4-4L7 4.5 5.5 2H6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                            </svg>
                            +91 XXXXX XXXXX
                        </a>

                        {/* Contact Us button */}
                        <Link
                            to="/contact"
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer hover:shadow-lg active:scale-95 flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
                                textDecoration: 'none',
                            }}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>

            </div>
        </section>
        </>
    );
}
