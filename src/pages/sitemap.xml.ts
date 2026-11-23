// Erzeugt /sitemap.xml automatisch aus allen Seiten.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { alleArtikel, artikelPfad } from '../lib/ratgeber';

export const GET: APIRoute = async ({ site }) => {
  const basis = site ?? new URL('https://tire-deals.com');
  const artikel = await alleArtikel();
  const seiten = await getCollection('seiten', (s) => s.id !== 'startseite' && !s.data.noindex);

  const tag = (d?: Date) => d?.toISOString().slice(0, 10);
  const neuestes = artikel
    .map((a) => a.data.aktualisiert ?? a.data.veroeffentlicht)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const eintraege: { pfad: string; lastmod?: string }[] = [
    { pfad: '/', lastmod: tag(neuestes) },
    { pfad: '/ratgeber/', lastmod: tag(neuestes) },
    ...artikel.map((a) => ({
      pfad: artikelPfad(a.id),
      lastmod: tag(a.data.aktualisiert ?? a.data.veroeffentlicht),
    })),
    { pfad: '/reifenfinder/' },
    ...seiten.map((s) => ({ pfad: `/${s.id}/`, lastmod: tag(s.data.aktualisiert) })),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    eintraege
      .map(
        (e) =>
          `  <url><loc>${new URL(e.pfad, basis).href}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`,
      )
      .join('\n') +
    '\n</urlset>\n';

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
