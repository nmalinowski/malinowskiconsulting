import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const caps = {
  // U1 — per TSD-6 (inherited)
  'styles/tokens.css': 30 * 1024,
  'styles/base.css': 50 * 1024,
  'styles/themes.css': 40 * 1024,
  'styles/layout.css': 60 * 1024,
  'scripts/theme.js': 5 * 1024,
  'scripts/analytics.js': 8 * 1024,
  'scripts/analytics.config.js': 1 * 1024,
  'scripts/page-metadata.js': 4 * 1024,
  'scripts/nav.js': 3 * 1024,
  'scripts/boot.js': 3 * 1024,
  'index.html': 32 * 1024,
  // U2 — per TSD-U2-5 (≤100KB sum, per-file + pair caps)
  'scripts/components/bubble.js': 4 * 1024,
  'scripts/components/bubble.core.js': 12 * 1024,
  'styles/components/site-constellation.css': 4 * 1024,
  'scripts/components/site-constellation.js': 12 * 1024,
  'styles/components/bubble.css': 9 * 1024,
  'scripts/components/contact-form.js': 3 * 1024,
  'scripts/components/contact-form.core.js': 6 * 1024,
  'styles/components/contact-form.css': 10 * 1024,
  // U3 — per TSD-U3-4 (≤100KB sum, per-file caps)
  'scripts/service-page.js': 4 * 1024,
  'styles/pages/service.css': 12 * 1024,
  'vibe-code-cleanup/index.html': 24 * 1024,
  'ai-sdlc-training/index.html': 24 * 1024,
  // U4 — per TSD-U4-4 (≤100KB sum, per-file caps)
  'scripts/components/examples-filter.js': 8 * 1024,
  'scripts/components/examples-filter.core.js': 8 * 1024,
  'scripts/components/examples-content.js': 4 * 1024,
  'scripts/components/examples-content.core.js': 6 * 1024,
  'scripts/components/examples-content.data.js': 24 * 1024,
  'styles/components/examples.css': 8 * 1024,
  'tools/check-examples-dataset.ts': 4 * 1024,
  'examples/index.html': 24 * 1024,
  // guard self-cap — grown to cover U1+U2+U3+U4 (was 4KB for U1 alone; 8KB now that it checks 31 files + pair caps)
  'tools/check-asset-sizes.mjs': 8 * 1024
};
const U1_RELS = ['styles/tokens.css','styles/base.css','styles/themes.css','styles/layout.css','scripts/theme.js','scripts/analytics.js','scripts/analytics.config.js','scripts/page-metadata.js','scripts/nav.js','scripts/boot.js','index.html','styles/components/site-constellation.css','scripts/components/site-constellation.js'];
const U2_RELS = ['scripts/components/bubble.js','scripts/components/bubble.core.js','styles/components/bubble.css','scripts/components/contact-form.js','scripts/components/contact-form.core.js','styles/components/contact-form.css'];
const U3_RELS = ['scripts/service-page.js','styles/pages/service.css','vibe-code-cleanup/index.html','ai-sdlc-training/index.html'];
const U4_RELS = ['scripts/components/examples-filter.js','scripts/components/examples-filter.core.js','scripts/components/examples-content.js','scripts/components/examples-content.core.js','scripts/components/examples-content.data.js','styles/components/examples.css','tools/check-examples-dataset.ts','examples/index.html'];
let fail = false;
let sum = 0;
let scoredSum = 0;
let u1Sum = 0;
let u2Sum = 0;
let u3Sum = 0;
let u4Sum = 0;
console.log('Asset size check (pre-gzip): U1 + U2 + U3 + U4');
for (const [rel, cap] of Object.entries(caps)) {
  const abs = path.join(root, rel);
  let size = 0;
  try { size = fs.statSync(abs).size; } catch { console.error(`  MISSING  ${rel}`); fail = true; continue; }
  const pct = ((size / cap) * 100).toFixed(1);
  const ok = size <= cap;
  if (!ok) fail = true;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'}  ${rel}  ${size} / ${cap} B  (${pct}%)`);
  sum += size;
  if (rel !== 'tools/check-asset-sizes.mjs') scoredSum += size;
  if (U1_RELS.includes(rel)) u1Sum += size;
  if (U2_RELS.includes(rel)) u2Sum += size;
  if (U3_RELS.includes(rel)) u3Sum += size;
  if (U4_RELS.includes(rel)) u4Sum += size;
}
const UNIT_CAP = 100 * 1024;
const U4_CAP = 100 * 1024;
const SITE_CAP = 500 * 1024;
const u1Ok = u1Sum <= UNIT_CAP;
const u2Ok = u2Sum <= UNIT_CAP;
const u3Ok = u3Sum <= UNIT_CAP;
const u4Ok = u4Sum <= U4_CAP;
const siteOk = scoredSum <= SITE_CAP;
// pair caps per TSD-U2-5
const bubblePair = (fs.existsSync(path.join(root,'scripts/components/bubble.js'))?fs.statSync(path.join(root,'scripts/components/bubble.js')).size:0) + (fs.existsSync(path.join(root,'scripts/components/bubble.core.js'))?fs.statSync(path.join(root,'scripts/components/bubble.core.js')).size:0);
const contactPair = (fs.existsSync(path.join(root,'scripts/components/contact-form.js'))?fs.statSync(path.join(root,'scripts/components/contact-form.js')).size:0) + (fs.existsSync(path.join(root,'scripts/components/contact-form.core.js'))?fs.statSync(path.join(root,'scripts/components/contact-form.core.js')).size:0);
const bubblePairOk = bubblePair <= 12*1024;
const contactPairOk = contactPair <= 8*1024;
if (!bubblePairOk) { console.error(`  FAIL  bubble pair ${bubblePair} / ${12*1024} B`); fail=true; }
else console.log(`  OK    bubble pair ${bubblePair} / ${12*1024} B (${((bubblePair/(12*1024))*100).toFixed(1)}%)`);
if (!contactPairOk) { console.error(`  FAIL  contact-form pair ${contactPair} / ${8*1024} B`); fail=true; }
else console.log(`  OK    contact-form pair ${contactPair} / ${8*1024} B (${((contactPair/(8*1024))*100).toFixed(1)}%)`);
if (!u1Ok) fail = true;
if (!u2Ok) fail = true;
if (!u3Ok) fail = true;
if (!u4Ok) fail = true;
if (!siteOk) fail = true;
console.log(`  ----`);
console.log(`  ${u1Ok ? 'OK  ' : 'FAIL'}  U1 sum (excl. guard)  ${u1Sum} / ${UNIT_CAP} B  (${((u1Sum/UNIT_CAP)*100).toFixed(1)}%)`);
console.log(`  ${u2Ok ? 'OK  ' : 'FAIL'}  U2 sum (excl. guard)  ${u2Sum} / ${UNIT_CAP} B  (${((u2Sum/UNIT_CAP)*100).toFixed(1)}%)`);
console.log(`  ${u3Ok ? 'OK  ' : 'FAIL'}  U3 sum (excl. guard)  ${u3Sum} / ${UNIT_CAP} B  (${((u3Sum/UNIT_CAP)*100).toFixed(1)}%)`);
console.log(`  ${u4Ok ? 'OK  ' : 'FAIL'}  U4 sum (excl. guard)  ${u4Sum} / ${U4_CAP} B  (${((u4Sum/U4_CAP)*100).toFixed(1)}%)`);
console.log(`  ${siteOk ? 'OK  ' : 'FAIL'}  Site sum (U1+U2+U3+U4 excl. guard)  ${scoredSum} / ${SITE_CAP} B  (${((scoredSum/SITE_CAP)*100).toFixed(1)}%)`);
console.log(`        total incl. guard  ${sum} B`);
if (fail) { console.error('\nAsset size check FAILED.'); process.exit(1); }
console.log('\nAll caps passed.');
