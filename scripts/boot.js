// Malinowski Consulting — Boot orchestrator (U1-Foundation)
// Re-exports bootTheme for downstream units; analytics boot is self-bound in analytics.js
import { bootTheme } from './theme.js';
export { bootTheme };
import './analytics.js';
