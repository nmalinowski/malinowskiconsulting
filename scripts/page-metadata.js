// Malinowski Consulting — PageMetadata helper (U1-Foundation)
// For U3/U4 downstream units | entities.md §PageMetadata helper | BR5.1 | NFR-6.1
const ORIGIN = 'https://malinowskiconsulting.com';
const DEFAULT_OG = ORIGIN + '/images/og-default.png';
const DEFAULT_THEME = '#0d1117';

export function buildPageMetadata({ title, description, pathname, jsonLdExtra, ogImage, themeColor }) {
  if (typeof title !== 'string' || title.length === 0) throw new RangeError('title is required');
  if (title.length > 70) throw new RangeError('title must be <= 70 chars');
  if (typeof description !== 'string' || description.length === 0) throw new RangeError('description is required');
  if (description.length > 200) throw new RangeError('description must be <= 200 chars');
  if (typeof pathname !== 'string' || !pathname.startsWith('/')) throw new RangeError('pathname must be absolute path starting with /');
  const canonical = ORIGIN + pathname;
  let u;
  try { u = new URL(canonical); } catch (_) { throw new RangeError('canonical must be valid URL'); }
  if (u.protocol !== 'https:') throw new RangeError('canonical must be https');
  let ogResolved = ogImage || DEFAULT_OG;
  if (ogResolved.startsWith('/')) ogResolved = ORIGIN + ogResolved;
  try { const ou = new URL(ogResolved); if (ou.protocol !== 'https:') throw new Error(); } catch (_) { throw new RangeError('ogImage must be https URL'); }
  if (themeColor != null && !/^#[0-9a-fA-F]{3,8}$/.test(themeColor)) throw new RangeError('themeColor must be hex');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Malinowski Consulting',
    url: canonical,
    image: ogResolved,
    description: description,
    ...(jsonLdExtra && typeof jsonLdExtra === 'object' ? jsonLdExtra : {})
  };
  return {
    title: title,
    description: description,
    canonical: canonical,
    ogImage: ogResolved,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    jsonLd: jsonLd,
    themeColor: themeColor || DEFAULT_THEME
  };
}
