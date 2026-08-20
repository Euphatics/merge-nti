/**
 * JSON-LD structured-data builders.
 * Each function returns a plain object ready for JSON.stringify().
 */

import { BASE_URL } from '../config/routes';

/**
 * BreadcrumbList schema.
 * @param {Array<{name: string, path: string}>} items
 */
export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    ...(item.path ? { item: `${BASE_URL}${item.path}` } : {}),
  })),
});

/**
 * FAQPage schema.
 * @param {Array<{question: string, answer: string}>} faqs
 */
export const buildFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/**
 * Course schema (useful for syllabus pages).
 * @param {object} opts
 */
export const buildCourseSchema = ({
  name,
  description,
  provider = 'National Talent Information',
  path,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: provider,
    url: BASE_URL,
  },
  url: `${BASE_URL}${path}`,
});
