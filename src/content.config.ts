// Definiert, welche Felder im Kopfbereich (Frontmatter) der Markdown-Dateien
// erlaubt sind. Fehlt ein Pflichtfeld, bricht der Build mit einer klaren
// Fehlermeldung ab – so fallen Tippfehler sofort auf.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ratgeber = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ratgeber' }),
  schema: z.object({
    /** Seitentitel (Überschrift und <title>). Ideal: unter 60 Zeichen. */
    title: z.string(),
    /** Meta-Beschreibung für Google. Ideal: 120–155 Zeichen. */
    description: z.string(),
    /** Kurzer Anreißer für Übersichten und die Startseite. */
    kurz: z.string(),
    /** Nummer im „5 Schritte“-Pfad (1–5). Leer lassen für Zusatzartikel. */
    schritt: z.number().int().min(1).max(5).optional(),
    /** Kurzer Name des Schritts auf der Startseite. */
    schrittTitel: z.string().optional(),
    /** Reihenfolge in Übersichten und für „Weiter“-Links. */
    reihenfolge: z.number(),
    veroeffentlicht: z.coerce.date(),
    aktualisiert: z.coerce.date().optional(),
    /** IDs aus src/data/affiliate-links.yaml für den dezenten Kasten am Ende. */
    affiliate: z.array(z.string()).default([]),
  }),
});

const seiten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seiten' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Optionaler Einleitungstext (z. B. groß auf der Startseite). */
    einleitung: z.string().optional(),
    /** true = Suchmaschinen sollen die Seite nicht anzeigen. */
    noindex: z.boolean().default(false),
    aktualisiert: z.coerce.date().optional(),
  }),
});

export const collections = { ratgeber, seiten };
