import { getCollection, type CollectionEntry } from 'astro:content';

/** Alle Ratgeber-Artikel in der festgelegten Reihenfolge. */
export async function alleArtikel(): Promise<CollectionEntry<'ratgeber'>[]> {
  const artikel = await getCollection('ratgeber');
  return artikel.sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
}

export const artikelPfad = (id: string) => `/ratgeber/${id}/`;

export const datumDeutsch = (datum: Date) =>
  datum.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
