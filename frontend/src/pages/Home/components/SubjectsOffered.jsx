import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';

/* ── Decorative symbol definitions per subject ── */
const mathDecorations = [
  // Minus sign (top-left)
  { type: 'line', x1: 0, y1: 2, x2: 14, y2: 2, top: '8%', left: '-2%', rotate: -12, size: 22 },
  // Minus sign (bottom-left)
  { type: 'line', x1: 0, y1: 2, x2: 14, y2: 2, top: '62%', left: '-3%', rotate: 8, size: 20 },
  // X mark (top-right)
  { type: 'x', top: '6%', right: '2%', rotate: 15, size: 26 },
  // X mark (bottom-right)
  { type: 'x', top: '72%', right: '0%', rotate: -20, size: 22 },
  // Division sign (bottom-right area)
  { type: 'division', top: '88%', right: '8%', rotate: 10, size: 18 },
  // Plus (top center-right)
  { type: 'plus', top: '2%', right: '30%', rotate: 20, size: 16 },
];

const itDecorations = [
  // < bracket top-left
  { type: 'text', content: '<', top: '6%', left: '2%', rotate: -10, size: 22 },
  // > bracket top-right
  { type: 'text', content: '>', top: '8%', right: '4%', rotate: 12, size: 24 },
  // / slash bottom-left
  { type: 'text', content: '/', top: '65%', left: '0%', rotate: -15, size: 20 },
  // { curly brace bottom-right
  { type: 'text', content: '{', top: '70%', right: '2%', rotate: 18, size: 22 },
  // # hash top center
  { type: 'text', content: '#', top: '2%', right: '32%', rotate: 22, size: 16 },
  // } curly brace bottom
  { type: 'text', content: '}', top: '88%', right: '10%', rotate: -8, size: 18 },
];

const scienceDecorations = [
  // Atom ring (top-left)
  { type: 'atom', top: '5%', left: '0%', rotate: -20, size: 24 },
  // Flask (top-right)
  { type: 'flask', top: '4%', right: '3%', rotate: 15, size: 26 },
  // Dot molecule (bottom-left)
  { type: 'molecule', top: '68%', left: '-2%', rotate: 10, size: 22 },
  // Star / sparkle (bottom-right)
  { type: 'star', top: '75%', right: '0%', rotate: -25, size: 20 },
  // Wave (top center)
  { type: 'wave', top: '0%', right: '28%', rotate: 0, size: 18 },
  // Atom ring (bottom)
  { type: 'atom', top: '90%', right: '12%', rotate: 30, size: 16 },
];

const englishDecorations = [
  // Open quote (top-left)
  { type: 'text', content: '"', top: '4%', left: '2%', rotate: -8, size: 26 },
  // Close quote (top-right)
  { type: 'text', content: '"', top: '6%', right: '4%', rotate: 12, size: 24 },
  // A letter (bottom-left)
  { type: 'text', content: 'A', top: '66%', left: '0%', rotate: -18, size: 20 },
  // & ampersand (bottom-right)
  { type: 'text', content: '&', top: '72%', right: '2%', rotate: 20, size: 22 },
  // abc (top center-right)
  { type: 'text', content: 'a', top: '1%', right: '30%', rotate: 15, size: 16 },
  // Comma (bottom)
  { type: 'text', content: ',', top: '90%', right: '14%', rotate: -10, size: 18 },
];

const financeDecorations = [
  // Rupee sign (top-left)
  { type: 'text', content: '₹', top: '6%', left: '2%', rotate: -12, size: 22 },
  // Dollar (top-right)
  { type: 'text', content: '$', top: '5%', right: '4%', rotate: 18, size: 26 },
  // Percent (bottom-left)
  { type: 'text', content: '%', top: '64%', left: '-1%', rotate: 10, size: 20 },
  // Up arrow chart (bottom-right)
  { type: 'chart', top: '72%', right: '0%', rotate: -15, size: 24 },
  // Coin (top center)
  { type: 'text', content: '¢', top: '2%', right: '28%', rotate: 22, size: 16 },
  // Euro (bottom)
  { type: 'text', content: '€', top: '88%', right: '10%', rotate: -8, size: 18 },
];

/* ── SVG renderers for each decoration type ── */
const DecorationSVG = ({ deco, color }) => {
  const style = {
    position: 'absolute',
    top: deco.top,
    left: deco.left,
    right: deco.right,
    width: deco.size,
    height: deco.size,
    transform: `rotate(${deco.rotate}deg)`,
    opacity: 0.35,
    pointerEvents: 'none',
    zIndex: 1,
    transition: 'opacity 0.3s ease',
  };

  switch (deco.type) {
    case 'line':
      return (
        <svg style={style} viewBox="0 0 14 4" fill="none">
          <line x1="0" y1="2" x2="14" y2="2" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'x':
      return (
        <svg style={style} viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="2" x2="14" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="2" x2="2" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'division':
      return (
        <svg style={style} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3" r="2" fill={color} />
          <line x1="2" y1="8" x2="14" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="8" cy="13" r="2" fill={color} />
        </svg>
      );
    case 'plus':
      return (
        <svg style={style} viewBox="0 0 16 16" fill="none">
          <line x1="8" y1="2" x2="8" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="2" y1="8" x2="14" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'atom':
      return (
        <svg style={style} viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="10" rx="8" ry="3" stroke={color} strokeWidth="1.5" />
          <ellipse cx="10" cy="10" rx="8" ry="3" stroke={color} strokeWidth="1.5" transform="rotate(60 10 10)" />
          <ellipse cx="10" cy="10" rx="8" ry="3" stroke={color} strokeWidth="1.5" transform="rotate(120 10 10)" />
          <circle cx="10" cy="10" r="2" fill={color} />
        </svg>
      );
    case 'flask':
      return (
        <svg style={style} viewBox="0 0 20 22" fill="none">
          <path d="M7 2h6v6l5 10a1 1 0 01-.9 1.5H2.9A1 1 0 012 18L7 8V2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="6" y1="2" x2="14" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'molecule':
      return (
        <svg style={style} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3" fill={color} />
          <circle cx="3" cy="5" r="2" fill={color} opacity="0.6" />
          <circle cx="17" cy="5" r="2" fill={color} opacity="0.6" />
          <circle cx="5" cy="17" r="2" fill={color} opacity="0.6" />
          <line x1="10" y1="10" x2="3" y2="5" stroke={color} strokeWidth="1" />
          <line x1="10" y1="10" x2="17" y2="5" stroke={color} strokeWidth="1" />
          <line x1="10" y1="10" x2="5" y2="17" stroke={color} strokeWidth="1" />
        </svg>
      );
    case 'star':
      return (
        <svg style={style} viewBox="0 0 16 16" fill={color}>
          <path d="M8 0l2 5h5l-4 3.5 1.5 5L8 11l-4.5 2.5L5 8.5 1 5h5z" />
        </svg>
      );
    case 'wave':
      return (
        <svg style={style} viewBox="0 0 24 8" fill="none">
          <path d="M0 4c3-4 5 4 8 0s5 4 8 0s5 4 8 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'chart':
      return (
        <svg style={style} viewBox="0 0 20 20" fill="none">
          <polyline points="2,16 7,10 11,13 18,4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14,4 18,4 18,8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'text':
      return (
        <span
          style={{
            ...style,
            fontWeight: 800,
            fontFamily: 'Inter, sans-serif',
            color: color,
            fontSize: deco.size * 1.1,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: deco.size * 1.2,
            height: deco.size * 1.2,
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          {deco.content}
        </span>
      );
    default:
      return null;
  }
};

/** Map topic name → route path for a given subject slug */
const getTopicPath = (topic, subjectSlug) => {
  switch (topic) {
    case 'Syllabus':      return ROUTES.syllabusDetail(subjectSlug);
    case 'Sample Paper':  return `/previous-year/${subjectSlug}`;
    case 'Rankers':       return ROUTES.subjectRankers;
    case 'Exam Dates':    return ROUTES.examDates;
    case 'Fees':          return ROUTES.markingScheme;
    default:              return null; // 'About', 'Workbook' — no dedicated page yet
  }
};

const subjects = [
  {
    name: 'National Mathematics Olympiad (NMO)',
    slug: 'mathematics',
    color: '#4F46E5',
    decorColor: '#818CF8',
    bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    decorations: mathDecorations,
    matteBg: '#6366F1',
    topics: ['About', 'Sample Paper', 'Syllabus', 'Fees', 'Rankers', 'Exam Dates', 'Workbook'],
    logo: (
      <img src="/icons8-math-50.png" alt="NTI Mathematics Olympiad logo icon" className="w-7 h-7 object-contain select-none brightness-0 invert" />
    )
  },
  {
    name: 'National Information Technology Olympiad (NIO)',
    slug: 'information-technology',
    color: '#0D9488',
    decorColor: '#2DD4BF',
    bgGradient: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
    decorations: itDecorations,
    matteBg: '#14B8A6',
    topics: ['About', 'Sample Paper', 'Syllabus', 'Fees', 'Rankers', 'Exam Dates', 'Workbook'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 select-none" fill="white">
        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
      </svg>
    )
  },
  {
    name: 'National Science Olympiad (NSO)',
    slug: 'science',
    color: '#059669',
    decorColor: '#34D399',
    bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    decorations: scienceDecorations,
    matteBg: '#10B981',
    topics: ['About', 'Sample Paper', 'Syllabus', 'Fees', 'Rankers', 'Exam Dates', 'Workbook'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 select-none" fill="white">
        <path d="M19.8 18.4L14 10.2V5h1V3H9v2h1v5.2L4.2 18.4c-.5.7-.1 1.6.8 1.6h14c.9 0 1.3-.9.8-1.6zM6.5 18l3.5-5V5h4v8l3.5 5H6.5z" />
      </svg>
    )
  },
  {
    name: 'National English Olympiad (NEO)',
    slug: 'english',
    color: '#7C3AED',
    decorColor: '#A78BFA',
    bgGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    decorations: englishDecorations,
    matteBg: '#8B5CF6',
    topics: ['About', 'Sample Paper', 'Syllabus', 'Fees', 'Rankers', 'Exam Dates', 'Workbook'],
    logo: (
      <img src="/assets/icons/auto_stories_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt="NTI English Olympiad book logo icon" className="w-7 h-7 object-contain select-none brightness-0 invert" />
    )
  },
  {
    name: 'National Finance Olympiad (NFO)',
    slug: 'finance',
    color: '#E11D48',
    decorColor: '#FB7185',
    bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    decorations: financeDecorations,
    matteBg: '#F43F5E',
    topics: ['About', 'Sample Paper', 'Syllabus', 'Fees', 'Rankers', 'Exam Dates', 'Workbook'],
    logo: (
      <img src="/assets/icons/finance_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt="NTI Finance Olympiad growth chart logo icon" className="w-7 h-7 object-contain select-none brightness-0 invert" />
    )
  }
];

// Memoized SubjectCard component to prevent unnecessary re-renders
const SubjectCard = React.memo(({ sub }) => {
  return (
    <div className="group flex flex-col justify-between w-full bg-white border border-gray-200/60 cursor-default overflow-hidden">
      {/* Centered Header Section with custom gradient */}
      <div
        className="w-full p-5 flex flex-col items-center gap-3 border-b border-gray-200/40"
        style={{ background: sub.bgGradient }}
      >
        {/* Circular Icon badge */}
        <div
          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: sub.matteBg }}
        >
          {sub.logo}
        </div>

        {/* Subject Label */}
        <h3 className="relative z-10 text-base font-bold text-gray-800 text-center tracking-wide group-hover:text-gray-900 transition-colors duration-200">
          {sub.name}
        </h3>
      </div>

      {/* Card Body */}
      <div className="w-full flex-1 p-5 flex flex-col justify-between gap-4 relative">
        {/* Decorative subject-themed symbols scattered around the card */}
        {sub.decorations && sub.decorations.map((deco, i) => (
          <DecorationSVG key={i} deco={deco} color={sub.decorColor} />
        ))}

        {/* Topics / Syllabus items */}
        <ul className="relative z-10 w-full grid grid-cols-2 gap-x-1 gap-y-3 pt-2 pb-1">
          {sub.topics.map((topic, idx) => {
            const path = getTopicPath(topic, sub.slug);
            return (
              <li key={idx} className="flex items-center gap-1.5">
                <span
                  className="text-base leading-none flex-shrink-0"
                  style={{ color: sub.color }}
                >
                  ▸
                </span>
                {path ? (
                  <Link
                    to={path}
                    className="text-[13.5px] font-bold truncate hover:underline transition-colors cursor-pointer"
                    style={{ color: sub.color, textDecoration: 'none' }}
                  >
                    {topic}
                  </Link>
                ) : (
                  <span className="text-[13.5px] font-bold text-gray-800 truncate">
                    {topic}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Divider line */}
        <div className="border-t border-gray-200/60 my-1 w-full" />

        {/* Know More Button */}
        <Link
          to={ROUTES.syllabusDetail(sub.slug)}
          className="w-full py-2 px-4 text-xs font-bold transition-all duration-200 flex items-center justify-center hover:opacity-90 active:scale-[0.98] cursor-pointer text-center"
          style={{
            backgroundColor: sub.matteBg,
            color: '#FFFFFF'
          }}
        >
          Know More
        </Link>
      </div>
    </div>
  );
});

SubjectCard.displayName = 'SubjectCard';

export default function SubjectsOffered() {
  return (
    <section className="w-full bg-[#467fcf] py-8 lg:py-12 border-b border-blue-400">
      <div className="w-full px-6 sm:px-10 lg:px-16">

        {/* Heading section styled to match Important Information exactly */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            Subjects Offered
          </h2>
          <div className="h-1 w-12 bg-white mt-1.5 rounded-full"></div>
        </div>

        {/* Subjects horizontal grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {subjects.map((sub) => (
            <SubjectCard key={sub.name} sub={sub} />
          ))}
        </div>

      </div>
    </section>
  );
}