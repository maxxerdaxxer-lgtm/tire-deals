# tire-deals.com – Tire-Deals Reifenratgeber

Deutschsprachiger Reifen-Ratgeber für Einsteiger in Deutschland und Österreich.
Gebaut mit [Astro](https://astro.build) als statische Website, veröffentlicht über GitHub Pages.

- Keine Cookies, kein Tracking, keine externen Schriftarten
- JavaScript nur auf der Reifenfinder-Seite (läuft lokal im Browser, speichert nichts)
- Texte als Markdown-Dateien – leicht selbst zu ändern

---

## Wo finde ich was?

| Was | Datei / Ordner |
| --- | --- |
| Ratgeber-Artikel | `src/content/ratgeber/*.md` |
| Startseite (Texte) | `src/content/seiten/startseite.md` |
| FAQ | `src/content/seiten/faq.md` |
| Impressum | `src/content/seiten/impressum.md` |
| Datenschutzerklärung | `src/content/seiten/datenschutz.md` |
| Wie wir Geld verdienen | `src/content/seiten/wie-wir-geld-verdienen.md` |
| **Affiliate-Links** | `src/data/affiliate-links.yaml` |
| Website-Name, Navigation, Footer-Links | `src/data/site.ts` |
| Reifenfinder (Fragen, Ergebnisse, Logik) | `src/pages/reifenfinder.astro` |
| Farben und Gestaltung | `src/styles/global.css` (ganz oben die Farb-Variablen) |
| Grafiken | `public/grafiken/*.svg` |
| Vorschaubild für soziale Netzwerke | `public/og-image.jpg` |

## Texte ändern

Öffne die passende `.md`-Datei und ändere den Text. Ganz oben zwischen den `---` steht der
„Kopfbereich“ (Frontmatter) mit Titel und Beschreibung für Google:

```yaml
---
title: "Seitentitel (ideal unter 60 Zeichen)"
description: "Beschreibung für Google (ideal 120–155 Zeichen)"
---
```

Darunter folgt der normale Text in Markdown:

```markdown
## Zwischenüberschrift

Normaler Absatz mit **fettem Text** und einem [Link](/ratgeber/eu-reifenlabel/).

- Aufzählungspunkt
- noch einer
```

### Infokästen

```markdown
> [!TIPP]
> Hier steht der Tipp.

> [!WARNUNG] Eigene Überschrift
> Hier steht die Warnung.
```

Verfügbar: `TIPP`, `WARNUNG`, `WICHTIG`, `INFO`, `RECHT` (für rechtliche Hinweise).

### Neuen Ratgeber-Artikel anlegen

Kopiere einen bestehenden Artikel in `src/content/ratgeber/`, gib ihm einen neuen Dateinamen
(der Dateiname wird zur Adresse, z. B. `luftdruck.md` → `/ratgeber/luftdruck/`) und passe den
Kopfbereich an. Für Zusatzartikel außerhalb der 5 Schritte lässt du `schritt` einfach weg und
wählst eine passende `reihenfolge`.

## PRÜFEN-Markierungen

Alle Zahlen und rechtlichen Angaben sind in den Dateien mit einem Kommentar markiert:

```markdown
<!-- PRÜFEN: 1,6 mm Mindestprofiltiefe (§ 36 Abs. 2 StVZO) -->
```

Diese Kommentare sind **nur in den Dateien sichtbar**, nicht auf der Website.
Eine Liste aller Stellen bekommst du im Terminal mit:

```bash
grep -rn "PRÜFEN" src
```

Auf GitHub kannst du alternativ im Repository oben in die Suche `PRÜFEN` eingeben.
Wenn du eine Stelle geprüft hast, kannst du den Kommentar löschen.

## Affiliate-Links pflegen

Alle Partner-Links stehen zentral in **`src/data/affiliate-links.yaml`**. Dort ist jeder Eintrag
erklärt. Kurz gesagt:

1. Trage beim passenden Eintrag deinen Link bei `url: ""` ein.
2. Solange `url` leer ist, erscheint der Link auf der Live-Seite **nicht** (in der lokalen
   Vorschau siehst du einen gestrichelten Platzhalter).

Einbinden kannst du Links auf zwei Arten:

- **Im Text:** `[Preise vergleichen](affiliate:vergleich-1)`
- **Als dezenter Kasten am Artikelende** (im Kopfbereich des Artikels):

  ```yaml
  affiliateTitel: "Preise für deine Reifengröße vergleichen"
  affiliate:
    - vergleich-1
    - reifenshop-1
  ```

Jeder Affiliate-Link bekommt automatisch `rel="sponsored nofollow noopener"` und den sichtbaren
Hinweis „(Werbung/Affiliate-Link)“.

## Lokal ansehen (optional)

Du brauchst [Node.js](https://nodejs.org) ab Version 22.23.4 (empfohlen: 24).

```bash
npm install      # einmalig
npm run dev      # Vorschau unter http://localhost:4321
npm run build    # fertige Website in den Ordner dist/ bauen
```

Hinweis: Wenn du während `npm run dev` die Affiliate-Datei änderst, starte die Vorschau neu
(Strg+C, dann wieder `npm run dev`).

## Veröffentlichen

Jeder Push auf den Branch `main` baut die Website automatisch und veröffentlicht sie über
GitHub Pages (siehe `.github/workflows/deploy.yml`). Den Fortschritt siehst du im Repository
unter **Actions**.

### Einmalige Einrichtung von GitHub Pages

1. Repository auf GitHub öffnen → **Settings** → links **Pages**.
2. Unter **Build and deployment** bei **Source** die Option **GitHub Actions** wählen.
3. Den Code auf `main` bringen (z. B. Pull Request mergen). Unter **Actions** startet dann
   „Website veröffentlichen“.
4. Wieder unter **Settings → Pages** bei **Custom domain** `tire-deals.com` eintragen und
   **Save** klicken.
5. Sobald die DNS-Prüfung grün ist und das Zertifikat ausgestellt wurde (kann bis zu 24 Stunden
   dauern), den Haken bei **Enforce HTTPS** setzen.

### DNS-Einträge beim Domain-Anbieter

| Typ | Name / Host | Wert |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `maxxerdaxxer-lgtm.github.io` |

Vorher alte A-/AAAA-Einträge für `@` und `www` (z. B. von einer Parkseite) löschen.
Die Werte bitte mit der offiziellen Anleitung abgleichen:
<https://docs.github.com/de/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>

Die Datei `public/CNAME` enthält `tire-deals.com`. Beim Veröffentlichen über GitHub Actions ist
aber die Einstellung unter **Settings → Pages → Custom domain** maßgeblich.
