# Informaatika PS

Vite + React + react-three-fiber sait (avaleht ja blogi).

## Dekoratiivne 3D (`src/components/decor`)

`<Decor3D />` on puhtalt dekoratiivne 3D-animatsioon, mis ei saa lehte kunagi katki teha:

| Olukord | Tulemus |
|---|---|
| WebGL töötab | pöörlev 3D-kujund |
| `prefers-reduced-motion: reduce` | staatiline variant, three.js-i ei laadita |
| WebGL puudub / blokeeritud / `getContext` viskab erindi | staatiline variant |
| renderduskonteksti loomine ebaõnnestub | eraldi veapiir → staatiline variant |
| three.js-i tüki laadimine ebaõnnestub | eraldi veapiir → staatiline variant |
| WebGL-kontekst kaob töö ajal | staatiline variant |

`fallback="illustration"` (vaikimisi) kuvab SVG-illustratsiooni, `fallback="hidden"` jätab dekoratsiooni peitu
(kasutusel blogipostitustes). Dekoratsioon on `aria-hidden` ja `pointer-events: none`.
3D-vead ei jõua kunagi marsruudi `errorElement`-ini (kogu lehe veavaade).

## Käsud

```bash
npm install
npm run dev
npm run build
npm run preview   # teises terminalis, enne testi
npm run test:e2e  # kontrollib kõiki ülaltoodud olukordi Playwright Chromiumis
```
