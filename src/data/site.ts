// Zentrale Angaben zur Website. Änderungen hier wirken auf allen Seiten.

export const SITE = {
  /** Name im Logo und in den Seitentiteln. */
  name: 'Tire-Deals Reifenratgeber',
  kurzname: 'Tire-Deals',
  url: 'https://tire-deals.com',
  sprache: 'de',
  locale: 'de_DE',
  /** Standard-Beschreibung, falls eine Seite keine eigene hat. */
  beschreibung:
    'Verständlicher Reifen-Ratgeber für Deutschland und Österreich: Reifengröße ablesen, Sommer-, Winter- oder Ganzjahresreifen wählen, EU-Reifenlabel verstehen.',
  /** Wird als „Autor“ in den strukturierten Daten genannt. */
  redaktion: 'Redaktion Tire-Deals Reifenratgeber',
  /** Standard-Vorschaubild für soziale Netzwerke (liegt in /public). */
  ogBild: '/og-image.jpg',
} as const;

/** Hauptnavigation im Kopfbereich. */
export const NAVIGATION = [
  { href: '/ratgeber/', text: 'Ratgeber' },
  { href: '/reifenfinder/', text: 'Reifenfinder' },
  { href: '/faq/', text: 'FAQ' },
] as const;

/** Links im Fußbereich. */
export const FOOTER_LINKS = [
  { href: '/impressum/', text: 'Impressum' },
  { href: '/datenschutz/', text: 'Datenschutz' },
  { href: '/wie-wir-geld-verdienen/', text: 'Wie wir Geld verdienen (Affiliate-Hinweis)' },
] as const;
