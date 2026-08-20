/**
 * SEO meta-tag builder.
 * Generates a structured object consumed by PageHelmet.
 */

import { BASE_URL } from '../config/routes';

const DEFAULT_OG_IMAGE = `${BASE_URL}/about_nti_banner.png`;
const SITE_NAME = 'NTI Olympiad';

/**
 * @param {object}  opts
 * @param {string}  opts.title        – Page title
 * @param {string}  opts.description  – Meta description
 * @param {string}  opts.path         – Path portion (e.g. "/contact")
 * @param {string}  [opts.ogImage]    – Custom OG image URL
 * @param {boolean} [opts.noindex]    – If true, adds robots noindex,follow
 * @returns {object} Structured meta data for PageHelmet
 */
export const buildPageMeta = ({
  title,
  description,
  path,
  ogImage,
  noindex = false,
}) => ({
  title,
  description,
  canonical: `${BASE_URL}${path}`,
  noindex,
  og: {
    type: 'website',
    title,
    description,
    siteName: SITE_NAME,
    image: ogImage || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}${path}`,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    image: ogImage || DEFAULT_OG_IMAGE,
  },
});
