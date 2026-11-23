// Strukturierte Daten (schema.org, JSON-LD) für Suchmaschinen.
import { SITE } from '../data/site';

const absolut = (pfad: string) => new URL(pfad, SITE.url).href;

export function organisation() {
  return {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: absolut('/apple-touch-icon.png'),
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: 'de',
    description: SITE.beschreibung,
    publisher: organisation(),
  };
}

export function artikel(daten: {
  titel: string;
  beschreibung: string;
  pfad: string;
  veroeffentlicht: Date;
  aktualisiert?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: daten.titel,
    description: daten.beschreibung,
    inLanguage: 'de',
    mainEntityOfPage: absolut(daten.pfad),
    url: absolut(daten.pfad),
    image: absolut(SITE.ogBild),
    datePublished: daten.veroeffentlicht.toISOString(),
    dateModified: (daten.aktualisiert ?? daten.veroeffentlicht).toISOString(),
    author: { '@type': 'Organization', name: SITE.redaktion, url: SITE.url },
    publisher: organisation(),
  };
}

export function brotkrumen(pfad: { text: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: pfad.map((teil, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: teil.text,
      ...(teil.href ? { item: absolut(teil.href) } : {}),
    })),
  };
}

export function faq(fragen: { frage: string; antwort: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'de',
    mainEntity: fragen.map(({ frage, antwort }) => ({
      '@type': 'Question',
      name: frage,
      acceptedAnswer: { '@type': 'Answer', text: antwort },
    })),
  };
}

/**
 * Liest Fragen und Antworten aus einem Markdown-Text:
 * Jede Überschrift „## …“ ist eine Frage, der Text darunter die Antwort.
 */
export function fragenAusMarkdown(markdown: string) {
  const ohneKommentare = markdown.replace(/<!--[\s\S]*?-->/g, '');
  return ohneKommentare
    .split(/^##\s+/m)
    .slice(1)
    .map((block) => {
      const [kopf, ...rest] = block.split('\n');
      return { frage: kopf.trim(), antwort: alsKlartext(rest.join('\n')) };
    })
    .filter((f) => f.frage && f.antwort);
}

/** Entfernt Markdown-Zeichen, damit die Antwort als einfacher Text vorliegt. */
function alsKlartext(md: string) {
  return md
    .replace(/^>\s?\[![A-Za-zÄÖÜäöü]+\][^\n]*\n?/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__|\*|_|`)/g, '')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/\n{2,}/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}
