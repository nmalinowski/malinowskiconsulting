// Malinowski Consulting — Navigation catalogue (U1-Foundation)
// entities.md §NavigationItem catalogue — 12 entries (5 nav + 4 footer + 3 external)
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/', location: 'nav', order: 1 },
  { id: 'vibe-code-cleanup', label: 'Vibe Code Clean-up', href: '/vibe-code-cleanup/', location: 'nav', order: 2 },
  { id: 'ai-sdlc-training', label: 'AI SDLC Training', href: '/ai-sdlc-training/', location: 'nav', order: 3 },
  { id: 'examples', label: 'Examples / Strategy', href: '/examples/', location: 'nav', order: 4 },
  { id: 'contact', label: 'Contact', href: '#contact', location: 'nav', order: 5 },
  { id: 'home-footer', label: 'Malinowski Consulting', href: '/', location: 'footer', order: 1 },
  { id: 'vibe-code-cleanup-footer', label: 'Vibe Code Clean-up', href: '/vibe-code-cleanup/', location: 'footer', order: 2 },
  { id: 'ai-sdlc-training-footer', label: 'AI SDLC Training', href: '/ai-sdlc-training/', location: 'footer', order: 3 },
  { id: 'examples-footer', label: 'Examples / Strategy', href: '/examples/', location: 'footer', order: 4 },
  { id: 'github', label: 'GitHub', href: 'https://github.com/nmalinowski/', location: 'footer', order: 90, external: true },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/nathanmalinowski/', location: 'footer', order: 91, external: true },
  { id: 'email', label: 'nathan@malinowskiconsulting.com', href: 'mailto:nathan@malinowskiconsulting.com', location: 'footer', order: 92, external: true }
];
