/**
 * Central registry: Olympiad subjects & class levels.
 * Every component that needs these constants should import from here
 * instead of maintaining its own copy.
 */

export const SUBJECTS = [
  {
    name: 'Mathematics Olympiad',
    slug: 'mathematics',
    abbr: 'NMO',
    label: 'NMO Syllabus',
    shortName: 'Mathematics',
  },
  {
    name: 'English Olympiad',
    slug: 'english',
    abbr: 'NEO',
    label: 'NEO Syllabus',
    shortName: 'English',
  },
  {
    name: 'Science Olympiad',
    slug: 'science',
    abbr: 'NSO',
    label: 'NSO Syllabus',
    shortName: 'Science',
  },
  {
    name: 'Information Technology Olympiad',
    slug: 'information-technology',
    abbr: 'NITO',
    label: 'NITO Syllabus',
    shortName: 'Information Technology',
  },
  {
    name: 'Finance Olympiad',
    slug: 'finance',
    abbr: 'NFO',
    label: 'NFO Syllabus',
    shortName: 'Finance',
  },
];

export const CLASS_LEVELS = [
  { name: 'Class 1', slug: 'class-1', number: 1 },
  { name: 'Class 2', slug: 'class-2', number: 2 },
  { name: 'Class 3', slug: 'class-3', number: 3 },
  { name: 'Class 4', slug: 'class-4', number: 4 },
  { name: 'Class 5', slug: 'class-5', number: 5 },
  { name: 'Class 6', slug: 'class-6', number: 6 },
  { name: 'Class 7', slug: 'class-7', number: 7 },
  { name: 'Class 8', slug: 'class-8', number: 8 },
  { name: 'Class 9', slug: 'class-9', number: 9 },
  { name: 'Class 10', slug: 'class-10', number: 10 },
];

/** Navbar-style category names (convenience re-export) */
export const OLYMPIAD_CATEGORIES = SUBJECTS.map((s) => s.name);

// ── Lookup helpers ──────────────────────────────────────────

export const getSubjectBySlug = (slug) =>
  SUBJECTS.find((s) => s.slug === slug) || null;

export const getSubjectByName = (name) =>
  SUBJECTS.find((s) => s.name === name) || null;

export const getClassBySlug = (slug) =>
  CLASS_LEVELS.find((c) => c.slug === slug) || null;
