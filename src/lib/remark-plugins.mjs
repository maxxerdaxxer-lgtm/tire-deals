// Kleine Erweiterungen für die Markdown-Texte.
// Du musst hier normalerweise nichts ändern.
//
// 1) Infokästen:
//      > [!TIPP]
//      > Dein Text …
//    Erlaubt sind: TIPP, WARNUNG, WICHTIG, INFO, RECHT
//    Eigene Überschrift:  > [!TIPP] Meine Überschrift
//
// 2) Affiliate-Links:
//      [Linktext](affiliate:reifenshop-1)
//    Die Adresse kommt aus src/data/affiliate-links.yaml.
//
// 3) HTML-Kommentare wie <!-- PRÜFEN: … --> werden aus der fertigen
//    Website entfernt. Sie bleiben nur in deinen Markdown-Dateien sichtbar.

import { SKIP, visit } from 'unist-util-visit';
import { AFFILIATE_HINWEIS, AFFILIATE_REL, findeAffiliateLink, istAktiv } from './affiliate.mjs';

const KASTEN_TYPEN = {
  TIPP: 'Tipp',
  TIP: 'Tipp',
  WARNUNG: 'Achtung',
  WARNING: 'Achtung',
  WICHTIG: 'Wichtig',
  IMPORTANT: 'Wichtig',
  INFO: 'Gut zu wissen',
  NOTE: 'Gut zu wissen',
  RECHT: 'Rechtlicher Hinweis',
};

const KASTEN_KLASSE = {
  Tipp: 'tipp',
  Achtung: 'warnung',
  Wichtig: 'wichtig',
  'Gut zu wissen': 'info',
  'Rechtlicher Hinweis': 'recht',
};

/** Wandelt `> [!TIPP]`-Zitate in gestaltete Infokästen um. */
export function remarkInfokaesten() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const absatz = node.children[0];
      if (absatz?.type !== 'paragraph') return;
      const erster = absatz.children[0];
      if (erster?.type !== 'text') return;

      const treffer = /^\[!([A-ZÄÖÜa-zäöü]+)\][ \t]*([^\n]*)\n?/.exec(erster.value);
      if (!treffer) return;
      const standardTitel = KASTEN_TYPEN[treffer[1].toUpperCase()];
      if (!standardTitel) return;

      const titel = treffer[2].trim() || standardTitel;
      erster.value = erster.value.slice(treffer[0].length);
      if (!erster.value) absatz.children.shift();
      const leer = absatz.children.every((k) => k.type === 'text' && !k.value.trim());
      if (leer) node.children.shift();

      node.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['box-titel'] } },
        children: [{ type: 'strong', children: [{ type: 'text', value: titel }] }],
      });

      node.data = {
        hName: 'div',
        hProperties: {
          className: ['box', `box-${KASTEN_KLASSE[standardTitel]}`],
          role: 'note',
        },
      };
    });
  };
}

/** Ersetzt `affiliate:ID`-Links durch die echten Partner-Links. */
export function remarkAffiliateLinks() {
  const istEntwicklung = process.env.NODE_ENV !== 'production';

  return (tree, file) => {
    visit(tree, 'link', (node, index, parent) => {
      if (!node.url.startsWith('affiliate:') || !parent || index === undefined) return;
      const id = node.url.slice('affiliate:'.length).trim();
      const link = findeAffiliateLink(id);

      if (!link) {
        throw new Error(
          `Unbekannter Affiliate-Link "${id}" in ${file.path ?? 'einer Markdown-Datei'}. ` +
            'Bitte in src/data/affiliate-links.yaml anlegen.',
        );
      }

      if (!istAktiv(link)) {
        // Kein Link hinterlegt: Auf der Live-Seite bleibt nur der Text stehen.
        const ersatz = istEntwicklung
          ? [
              {
                type: 'affiliatePlatzhalter',
                data: {
                  hName: 'span',
                  hProperties: { className: ['affiliate-platzhalter'] },
                },
                children: [...node.children, { type: 'text', value: ` [Affiliate-Platzhalter: ${id}]` }],
              },
            ]
          : node.children;
        parent.children.splice(index, 1, ...ersatz);
        return [SKIP, index + ersatz.length];
      }

      node.url = link.url;
      node.data = {
        ...node.data,
        hProperties: { rel: AFFILIATE_REL, className: ['affiliate-link'] },
      };
      const hinweis = {
        type: 'affiliateHinweis',
        data: {
          hName: 'span',
          hProperties: { className: ['affiliate-hinweis'] },
          hChildren: [{ type: 'text', value: `(${AFFILIATE_HINWEIS})` }],
        },
      };
      parent.children.splice(index + 1, 0, { type: 'text', value: ' ' }, hinweis);
      return [SKIP, index + 3];
    });
  };
}

/** Entfernt HTML-Kommentare (z. B. <!-- PRÜFEN … -->) aus der Ausgabe. */
export function remarkKommentareEntfernen() {
  return (tree) => {
    visit(tree, 'html', (node, index, parent) => {
      if (!parent || index === undefined) return;
      const ohne = node.value.replace(/<!--[\s\S]*?-->/g, '');
      if (ohne.trim()) {
        node.value = ohne;
        return;
      }
      parent.children.splice(index, 1);
      return [SKIP, index];
    });
  };
}
