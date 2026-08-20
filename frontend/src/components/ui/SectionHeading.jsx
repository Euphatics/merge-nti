/**
 * SectionHeading
 * Renders a page or section heading with site-standard typography.
 *
 * Props:
 *   level     – 'h1' | 'h2' | 'h3'  (default: 'h1')
 *   className – additional Tailwind classes
 *   children  – heading text
 *
 * Level styles (preserve existing codebase classes exactly):
 *   h1 – text-2xl lg:text-[28px] font-normal text-[#333]
 *          (used in SyllabusClassPage, MarkingScheme page titles)
 *   h2 – text-3xl sm:text-4xl text-gray-900 font-semibold
 *          (used in RankersListPage, SubjectRankersPage)
 *   h3 – text-[32px] font-bold text-[#28589c]
 *          (used in SyllabusClassPage section headings)
 */
export default function SectionHeading({ level = 'h1', className = '', children }) {
  const styles = {
    h1: 'text-2xl lg:text-[28px] font-normal text-[#333]',
    h2: 'text-3xl sm:text-4xl text-gray-900 font-semibold',
    h3: 'text-[32px] font-bold text-[#28589c]',
  };

  const Tag = level;
  return (
    <Tag className={`${styles[level] ?? styles.h1} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
