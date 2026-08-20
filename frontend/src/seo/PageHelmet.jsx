/**
 * Reusable Helmet wrapper.
 * Accepts the structured object returned by buildPageMeta()
 * and optional JSON-LD schemas, then renders all <head> tags.
 *
 * Usage:
 *   const meta = buildPageMeta({ title, description, path });
 *   <PageHelmet meta={meta} schemas={[breadcrumbSchema]} />
 */

import { Helmet } from 'react-helmet-async';

export default function PageHelmet({ meta, schemas = [] }) {
  if (!meta) return null;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />

      {/* Robots */}
      {meta.noindex && (
        <meta name="robots" content="noindex,follow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={meta.og.type} />
      <meta property="og:title" content={meta.og.title} />
      <meta property="og:description" content={meta.og.description} />
      <meta property="og:site_name" content={meta.og.siteName} />
      <meta property="og:image" content={meta.og.image} />
      <meta property="og:url" content={meta.og.url} />

      {/* Twitter */}
      <meta name="twitter:card" content={meta.twitter.card} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={meta.twitter.image} />

      {/* JSON-LD Schemas */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
