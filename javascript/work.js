import { initNavigation } from './lib/nav.js';
import { initReveal } from './lib/reveal.js';
import { initMediaFrames } from './lib/mediaFrame.js';
import { initPalette } from './lib/palette.js';
import { initMode } from './lib/mode.js';
import { initGallery } from './lib/gallery.js';
import { initEvolution } from './lib/evolution.js';

/**
 * Case-study pages. The content is static HTML rendered at build time; these
 * modules only add behaviour on top of it, so the page reads fine without them.
 */
initNavigation();
initReveal();
initMediaFrames();
initPalette();
initMode();
initGallery();
initEvolution();
