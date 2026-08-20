/**
 * Default / fallback content generators.
 * Used when a subject+class combination exists in the data registry
 * but has no detailed content yet (published: false pages still
 * need titles for the "Coming Soon" page).
 */

/**
 * Generate a fallback meta title for an unpublished syllabus page.
 */
export const getDefaultMetaTitle = (subjectName, className) =>
  `${subjectName} ${className} Olympiad Syllabus – NTI`;

/**
 * Generate a fallback meta description.
 */
export const getDefaultMetaDescription = (subjectName, className) =>
  `The NTI ${subjectName} ${className} Olympiad syllabus is currently being prepared and will be published soon.`;

/**
 * Generate a display title for the Coming Soon page.
 */
export const getDefaultTitle = (subjectName, className) =>
  `${subjectName} Olympiad for ${className}`;
