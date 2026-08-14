import { initNavigation } from './lib/nav.js';
import { initReveal } from './lib/reveal.js';

/**
 * The case study is static content — it needs the shared site chrome and the
 * scroll reveal, and nothing else. The live app it describes is a separate
 * Next.js application served at /fantasy.
 */
initNavigation();
initReveal();
