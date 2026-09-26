# BodyMetric

A fast, free, private BMI calculator. Built with React, TypeScript, Vite, and Tailwind CSS.

- Calculations run entirely in the browser — nothing is sent to a server.
- No account, no subscription, no required personal information.
- Metric (kg/cm) and imperial (lb/ft+in) units, switchable without losing entered values.
- Adults (20+) get the four standard BMI categories. People aged 2–19 get the raw BMI value with an
  explanation of why adult categories don't apply, plus a link to the CDC's official Child and Teen BMI
  Calculator. Children under 2 get no BMI interpretation at all.
- Optional, restrained display advertising via a reusable `AdSlot` component — off by default, and the
  calculator works fully without it.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Environment variables

Copy `.env.example` to `.env` and fill in what you need:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | Recommended | Canonical URL used in SEO metadata and the generated `sitemap.xml`/`robots.txt`. Without it, those files fall back to a placeholder domain and a build-time warning is printed. |
| `VITE_AD_PUBLISHER_ID` | Optional | Ad provider publisher ID. Leave blank to keep ads disabled. |
| `VITE_AD_SLOT_ID` | Optional | Ad slot ID. Leave blank to keep ads disabled. |

Both ad variables must be set for any ad to load; with either blank, `AdSlot` renders a clearly labelled
development placeholder instead of a real ad, and the site remains fully usable.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check, build for production into `dist/`, then generate `robots.txt`/`sitemap.xml` from `VITE_SITE_URL`. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Run the automated test suite once (Vitest). |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run lint` | Run ESLint. |

## Testing

Automated tests live in `src/lib/bmi.test.ts` and cover:

- BMI calculation correctness (metric and imperial agree after conversion).
- Category boundaries being applied to the **unrounded** BMI value, not the displayed rounded value
  (e.g. an unrounded BMI of 18.46 rounds to a displayed 18.5 but must still classify as underweight).
- Unit conversion round-trips (kg↔lb, cm↔ft/in).
- Age banding (under 2 / 2–19 / 20+).
- The mathematical healthy-weight interval at a given height.
- Input validation: empty, zero, negative, non-numeric, and implausible values for age, height, and weight
  in both unit systems.

Run them with:

```bash
npm test
```

Before deploying, also manually verify:

- The production build passes: `npm run build`.
- The app is usable at a 320px viewport width and on desktop.
- Keyboard-only navigation and form submission work end to end.
- Switching units mid-entry preserves the measurements you typed.
- No network requests fire for height, weight, age, or the BMI result (check your browser's network tab).

## Deploying to Vercel

1. Push this project to a Git repository and import it in Vercel, or run `vercel` from this directory.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Set `VITE_SITE_URL` (and, optionally, the ad variables) as Vercel Environment Variables.
4. `vercel.json` includes a catch-all rewrite to `index.html` so client-side routes (`/privacy`, `/terms`)
   resolve correctly on refresh and direct navigation.

## Project structure

```
src/
  lib/bmi.ts          Pure calculation, conversion, and validation logic (unit tested)
  lib/bmi.test.ts      Automated tests
  components/          Calculator, ResultCard, Nav, Footer, AdSlot, section components
  pages/               Home, Privacy, Terms, NotFound
  App.tsx              Routing and layout shell
scripts/generate-seo.mjs   Post-build script that writes robots.txt/sitemap.xml from VITE_SITE_URL
```

## Notes and limitations

- This is a general screening tool, not a medical device. See the in-app Terms of Use and Privacy Policy.
- The child/teen flow intentionally does **not** compute a BMI-for-age percentile — implementing one
  correctly requires official, sourced LMS growth-chart data. Rather than approximate or invent a
  percentile, BodyMetric shows the raw BMI value and links to the CDC's own calculator for ages 2–19.
- Optional "remember my last entry" behavior (if you choose to add it) should use `localStorage` only,
  stay opt-in, and ship with a working "Clear Data" action, per the Privacy Policy's description of that
  feature.
