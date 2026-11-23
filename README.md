# oh design — web

Statický web bez build kroku (HTML + CSS + čistý JS). Úvod podle `oh design.ai` (slide 3),
struktura oslovení klienta podle acryondesign.com, animace podle auge-xp.com, obsah a fonty ze starého webu
(`mujwebportfolio---kopie`): **Space Grotesk** + **Georgia**.

## Spuštění

Web potřebuje lokální server (WebGL nesmí číst obrázky z `file://`):

```bash
cd oh-design-web
python3 -m http.server 8770
```

Pak otevři http://localhost:8770. Při dvojkliku na `index.html` web běží taky,
jen bez distortion efektů (obyčejné DOM zobrazení).

## Stránky

| Adresa | Co to je |
| --- | --- |
| `#/` | Úvod — 4 služby, oranžový slider jezdí za myší |
| `#/s/<služba>` | Stránka služby: oslovení, vybrané práce, co dostanete, postup, ceník, proč my, tým, FAQ, kontaktní formulář |
| `#/work/<slug>` | Detail projektu (na konci „Chcete něco podobného?“) |
| `#/about`, `#/talk` | O nás, kontakt s formulářem |

Služby: `motion-design`, `onesto-beta`, `brand-identity`, `web-design`.

## Kde co upravit

- **`js/data.js`** — všechen obsah, česky i anglicky (`{ en: …, cs: … }`):
  `OH.SERVICES` (nadpis, úvod, co dostanete, ceny, FAQ pro každou službu), `OH.STEPS` (postup),
  `OH.STUDIO` (tým, kontakty, „proč my“), `OH.UI` (popisky rozhraní), `OH.PROJECTS` (projekty;
  `cats` určuje, u kterých služeb se ukážou).
- **Ceny**: web od 7 000 Kč, předplatné Onesto individuálně, ostatní služby individuálně — v `OH.SERVICES[…].price`.
- **`js/dims.js`** — rozměry obrázků a videí pro galerii.
- **`css/styles.css`** — barvy nahoře v `:root` (`--bg` béžová, `--accent` oranžová).
- **`js/gl.js`** — WebGL vrstva; síla efektů je v `FX` (lupa, ohyb, vlnka) — teď jen jemně při rychlém pohybu/scrollu.
- **`js/app.js`** — router, stránky, animace, formulář.

## Formulář

Web nemá server, takže formulář po odeslání otevře e-mailového klienta návštěvníka
s předvyplněnou zprávou na `ondrej@ohdesign.eu` (adresa v `OH.STUDIO.mail`). Pokud chcete,
aby zprávy chodily bez e-mailového klienta, je potřeba napojit službu typu Formspree / Basin.

## Jazyk

Přepínač CZ / EN vpravo nahoře, volba se pamatuje v prohlížeči. Výchozí jazyk podle prohlížeče (čeština/slovenština → CZ).

## Poznámky

- Adresy jsou přes `#` (funguje na GitHub Pages i lokálně bez nastavování).
- `prefers-reduced-motion` vypíná distortion a animace přechodů.

- Při změně CSS/JS zvyš číslo `?v=` u odkazů v `index.html`, ať prohlížeče nenačítají starou verzi z cache.

## GitHub Pages

V repozitáři na GitHubu: Settings → Pages → Source: *Deploy from a branch*, větev `main`, složka `/ (root)`.
Web pak běží na `https://<účet>.github.io/<repozitář>/`.
