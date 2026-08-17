import { WORKFLOWS, INDUSTRIES } from '../scripts/components/examples-content.data.js';

const INDUSTRY_IDS = ['healthcare', 'finance', 'other'] as const;
const SLUG_RE = /^wf-[a-z][a-z0-9-]*$/;

const errors: string[] = [];

if (WORKFLOWS.length !== 12) errors.push(`WORKFLOWS.length = ${WORKFLOWS.length}, expected 12`);

const seen = new Set<string>();
const bucketCounts: Record<string, number> = { healthcare: 0, finance: 0, other: 0 };

for (const w of WORKFLOWS) {
  if (!SLUG_RE.test(w.id)) errors.push(`slug "${w.id}" does not match ${SLUG_RE}`);
  if (seen.has(w.id)) errors.push(`duplicate slug "${w.id}"`);
  seen.add(w.id);
  if (w.deepLinkHref !== `#${w.id}`) errors.push(`workflow "${w.id}" deepLinkHref mismatch`);
  if (!(INDUSTRY_IDS as readonly string[]).includes(w.industry as string)) errors.push(`workflow "${w.id}" invalid industry "${w.industry}"`);
  if (!(w.ai_suitability === 'good_fit' || w.ai_suitability === 'context_dependent' || w.ai_suitability === 'poor_fit')) errors.push(`workflow "${w.id}" invalid ai_suitability "${w.ai_suitability}"`);
  if (w.roi.kind !== 'range-hint') errors.push(`workflow "${w.id}" invalid roi.kind "${w.roi.kind}"`);
  if (!w.alternatives || w.alternatives.length < 1) errors.push(`workflow "${w.id}" alternatives is empty`);
  bucketCounts[w.industry] = (bucketCounts[w.industry] ?? 0) + 1;
}

for (const [bucket, count] of Object.entries(bucketCounts)) {
  if (count < 3) errors.push(`bucket "${bucket}" has ${count} workflows, expected >= 3`);
}

const expectedOrder = ['healthcare', 'finance', 'other'];
INDUSTRIES.forEach((ind, i) => {
  if (ind.id !== expectedOrder[i]) errors.push(`INDUSTRIES[${i}].id = "${ind.id}", expected "${expectedOrder[i]}"`);
});

if (errors.length) {
  console.error('check-examples-dataset: FAILED');
  errors.forEach(e => console.error('  -', e));
  process.exit(1);
}
console.log('check-examples-dataset: OK');
