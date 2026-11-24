// Astro-Konfiguration für tire-deals.com
// Doku: https://docs.astro.build/de/reference/configuration-reference/
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import {
  remarkAffiliateLinks,
  remarkInfokaesten,
  remarkKommentareEntfernen,
} from './src/lib/remark-plugins.mjs';

// Prüfsumme der Affiliate-Datei: Ändert sich die Datei, rendert Astro alle
// Markdown-Texte neu (sonst blieben alte Links im Zwischenspeicher hängen).
const affiliatePruefsumme = createHash('sha256')
  .update(readFileSync(new URL('./src/data/affiliate-links.yaml', import.meta.url)))
  .digest('hex')
  .slice(0, 16);

export default defineConfig({
  // Die endgültige Adresse der Website (für Canonical-Links, Sitemap, Open Graph).
  site: 'https://tire-deals.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  // Keine Telemetrie, kein Dev-Toolbar-Overlay nötig.
  devToolbar: { enabled: false },
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      gfm: true,
      // Typografische Anführungszeichen schreiben wir direkt im Text („…“),
      // damit keine englischen Anführungszeichen entstehen.
      smartypants: false,
      remarkPlugins: [
        remarkKommentareEntfernen,
        remarkInfokaesten,
        [remarkAffiliateLinks, { pruefsumme: affiliatePruefsumme }],
      ],
    }),
  },
});
