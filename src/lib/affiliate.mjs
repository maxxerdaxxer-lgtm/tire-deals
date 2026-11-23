// Lädt die zentrale Affiliate-Datei (src/data/affiliate-links.yaml).
// Wird sowohl von den Astro-Komponenten als auch vom Markdown-Plugin genutzt.
// Hier musst du normalerweise nichts ändern – Links pflegst du in der YAML-Datei.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const DATEI = join(process.cwd(), 'src', 'data', 'affiliate-links.yaml');

/** Sichtbarer Hinweis, der neben jedem Affiliate-Link steht. */
export const AFFILIATE_HINWEIS = 'Werbung/Affiliate-Link';

/** rel-Attribut für alle Affiliate-Links. */
export const AFFILIATE_REL = 'sponsored nofollow noopener';

/**
 * @typedef {{ id: string, name: string, url: string, beschreibung?: string, kategorie?: string }} AffiliateLink
 */

/** @returns {AffiliateLink[]} */
export function ladeAffiliateLinks() {
  const roh = parse(readFileSync(DATEI, 'utf8')) ?? [];
  if (!Array.isArray(roh)) {
    throw new Error(`${DATEI}: Die Datei muss eine Liste von Einträgen sein.`);
  }
  const ids = new Set();
  return roh.map((eintrag, i) => {
    if (!eintrag?.id || !eintrag?.name) {
      throw new Error(`${DATEI}: Eintrag Nr. ${i + 1} braucht mindestens "id" und "name".`);
    }
    if (ids.has(eintrag.id)) {
      throw new Error(`${DATEI}: Die id "${eintrag.id}" kommt doppelt vor.`);
    }
    ids.add(eintrag.id);
    const url = String(eintrag.url ?? '').trim();
    if (url && !/^https:\/\//.test(url)) {
      throw new Error(`${DATEI}: Die url von "${eintrag.id}" muss mit https:// beginnen.`);
    }
    return { ...eintrag, url };
  });
}

/** @returns {AffiliateLink | undefined} */
export function findeAffiliateLink(id) {
  return ladeAffiliateLinks().find((l) => l.id === id);
}

/** Ein Link ist „aktiv“, sobald eine URL eingetragen ist. */
export function istAktiv(link) {
  return Boolean(link && link.url);
}
