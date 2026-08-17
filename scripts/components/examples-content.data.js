export const INDUSTRIES = [
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'finance', label: 'Finance' },
  { id: 'other', label: 'Other' }
];

export const WORKFLOWS = [
  {
    id: 'wf-radiology',
    industry: 'healthcare',
    ai_suitability: 'context_dependent',
    title: 'Radiology report triage',
    summary: 'Inbound imaging reports are triaged by urgency so radiologists see critical cases first. AI drafts a provisional category, but a board-certified radiologist confirms every finding.',
    roi: { kind: 'range-hint', display: 'Typical payback 3–6 months.', note: 'Depends on imaging volume and PACS integration depth.' },
    alternatives: ['Rule-based routing from DICOM keyword tags', 'RIS vendor categorisation module'],
    deepLinkHref: '#wf-radiology'
  },
  {
    id: 'wf-cardiology',
    industry: 'healthcare',
    ai_suitability: 'context_dependent',
    title: 'Cardiology echo reporting',
    summary: 'Echocardiogram measurements are transcribed into structured reports for cardiologist review. AI pre-fills numeric fields and flags outliers, clinician validates every value.',
    roi: { kind: 'range-hint', display: 'Typical payback 4–8 months.', note: 'Depends on echo volume and EHR template maturity.' },
    alternatives: ['EHR template macros with validation rules', 'Vendor echo measurement import'],
    deepLinkHref: '#wf-cardiology'
  },
  {
    id: 'wf-prior-auth',
    industry: 'healthcare',
    ai_suitability: 'good_fit',
    title: 'Prior authorisation intake',
    summary: 'Payer prior-authorisation forms are extracted, validated, and routed for clinical review. AI handles OCR and field mapping, staff approve the submission packet.',
    roi: { kind: 'range-hint', display: 'Typical payback 2–4 months.', note: 'Depends on payer mix and form standardisation.' },
    alternatives: ['Rules engine for payer-specific checklists', 'Clearinghouse pre-validation service'],
    deepLinkHref: '#wf-prior-auth'
  },
  {
    id: 'wf-admin-billing',
    industry: 'healthcare',
    ai_suitability: 'good_fit',
    title: 'Administrative billing',
    summary: 'Encounter notes are coded into billing line items for revenue-cycle review. AI suggests codes from documentation, certified coders approve before submission.',
    roi: { kind: 'range-hint', display: 'Typical payback 1–3 months.', note: 'Depends on encounter volume and coding backlog.' },
    alternatives: ['Encoder software with claim scrubbing', 'Billing service rules automation'],
    deepLinkHref: '#wf-admin-billing'
  },
  {
    id: 'wf-fraud-detection',
    industry: 'finance',
    ai_suitability: 'context_dependent',
    title: 'Transaction fraud detection',
    summary: 'Card and wire transactions are scored for fraud risk before release. AI flags anomalous patterns, human investigators review high-risk cases within SLA.',
    roi: { kind: 'range-hint', display: 'Typical payback 3–6 months.', note: 'Depends on transaction volume and false-positive tolerance.' },
    alternatives: ['Rules-based velocity and threshold checks', 'Network risk scoring via processor'],
    deepLinkHref: '#wf-fraud-detection'
  },
  {
    id: 'wf-credit-underwriting',
    industry: 'finance',
    ai_suitability: 'context_dependent',
    title: 'SME credit underwriting',
    summary: 'Small-business loan files are scored from bank statements and bureau data. AI prepares a risk memo, credit officers own the final approve or decline.',
    roi: { kind: 'range-hint', display: 'Typical payback 4–9 months.', note: 'Depends on application volume and model governance overhead.' },
    alternatives: ['Scorecard models with manual review tiers', 'Bureau tri-merge plus cash-flow ratios'],
    deepLinkHref: '#wf-credit-underwriting'
  },
  {
    id: 'wf-claims-processing',
    industry: 'finance',
    ai_suitability: 'good_fit',
    title: 'Insurance claims processing',
    summary: 'First-notice-of-loss documents are extracted, validated against policy, and routed for adjuster review. AI handles intake triage, adjusters handle coverage decisions.',
    roi: { kind: 'range-hint', display: 'Typical payback 2–5 months.', note: 'Depends on claim volume and policy-data quality.' },
    alternatives: ['Claims rules engine with FNOL checklists', 'Straight-through processing for low-complexity claims'],
    deepLinkHref: '#wf-claims-processing'
  },
  {
    id: 'wf-kyc',
    industry: 'finance',
    ai_suitability: 'good_fit',
    title: 'KYC document review',
    summary: 'Customer identity documents are checked for completeness and consistency during onboarding. AI extracts fields and flags gaps, compliance analysts verify before activation.',
    roi: { kind: 'range-hint', display: 'Typical payback 1–3 months.', note: 'Depends on onboarding volume and document standardisation.' },
    alternatives: ['Document checklist workflow with verification queue', 'Vendor KYC screening integration'],
    deepLinkHref: '#wf-kyc'
  },
  {
    id: 'wf-legal-redaction',
    industry: 'other',
    ai_suitability: 'good_fit',
    title: 'Legal document redaction',
    summary: 'Privileged and personal data is located and redacted before discovery production. AI proposes candidate spans, attorneys review and sign the redacted set.',
    roi: { kind: 'range-hint', display: 'Typical payback 2–4 months.', note: 'Depends on discovery volume and review staffing.' },
    alternatives: ['Search-term driven redaction tools', 'Outsourced managed review with rules'],
    deepLinkHref: '#wf-legal-redaction'
  },
  {
    id: 'wf-finance-recon',
    industry: 'other',
    ai_suitability: 'poor_fit',
    title: 'Bank reconciliation',
    summary: 'Bank statements are matched to ledger entries and exceptions are queued for accountants. Deterministic matching catches most breaks without probabilistic guessing.',
    roi: { kind: 'range-hint', display: 'Limited payback potential.', note: 'Deterministic ledgers rarely benefit from AI; rules cover most cases.' },
    alternatives: ['Double-entry reconciliation rules engine', 'ERP bank-feed auto-match'],
    deepLinkHref: '#wf-finance-recon'
  },
  {
    id: 'wf-supply-chain',
    industry: 'other',
    ai_suitability: 'context_dependent',
    title: 'Supply chain risk monitoring',
    summary: 'Supplier signals are aggregated to surface disruption risks for operations review. AI ranks signals by severity, planners validate and trigger mitigation playbooks.',
    roi: { kind: 'range-hint', display: 'Typical payback 4–7 months.', note: 'Depends on supplier count and data-feed breadth.' },
    alternatives: ['Supplier scorecards with threshold alerts', 'Third-party risk intelligence feed'],
    deepLinkHref: '#wf-supply-chain'
  },
  {
    id: 'wf-procurement',
    industry: 'other',
    ai_suitability: 'good_fit',
    title: 'Procurement spend analytics',
    summary: 'Invoices and purchase orders are classified to surface spend leakage and vendor overlap. AI groups similar line items, procurement leads approve category decisions.',
    roi: { kind: 'range-hint', display: 'Typical payback 2–5 months.', note: 'Depends on spend volume and category taxonomy maturity.' },
    alternatives: ['Category taxonomy with rules-based mapping', 'Procurement suite spend dashboard'],
    deepLinkHref: '#wf-procurement'
  }
];
