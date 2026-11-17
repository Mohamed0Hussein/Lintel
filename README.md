# Lintel Homes

A brand and front-end prototype for **Lintel**, a home agency that sells, lets and values homes across **Solvenne**, a fictional country with five regions: Port Aubel, Lisle Coast, Vey Highlands, Marrow Valley and the Kestrel Isles.

Built with **React 18**, **React Router** (hash routing) and **Vite**. No UI library: the glassmorphism design is plain CSS in `src/styles.css`.

**Live site:** https://mohamed0hussein.github.io/Lintel/

## Run it

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build in dist/
npm run preview   # serve the build locally
```

## Deploy

Every push to `master` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages. The Vite `base` is relative (`./`) and routing uses the URL hash, so the build works at any path without server rewrites.

## Project structure

```
src/
  main.jsx              Router and app entry
  App.jsx               Routes
  styles.css            Design tokens, components and the glass layer
  context/AppContext    Saved homes, search filters, toasts, photo viewer
  components/
    Layout.jsx          Header (menu, theme toggle), footer
    Maps.jsx            Country map, results map (pins, clusters, pan/zoom), office map
    Elevation.jsx       Generated front-elevation drawings for every listing
    MarketChart.jsx     Price index chart
    Photo.jsx, bits.jsx Responsive images, cards and shared pieces
  pages/                Home, Results, Listing, Regions, Agents, Contact, About, Blog, Mortgage, Sell, Guides, Brand, Saved
  data/                 Regions, listings, agents and offices, articles, photo sets, map coordinates, mortgage deals
public/img/             Optimised WebP photos (800, 1600 and 2400 px)
```

## Pages

| Page | Route | Highlights |
|---|---|---|
| Home | `#/` | Photo hero, floating glass search, featured homes, regions, market index |
| Buy / Rent / New homes | `#/buy` `#/rent` `#/new-homes` | Filters with count badge, sort, list or map view with price pins, clustering, pan and zoom, "limit list to map area" |
| Listing | `#/listing/:id` | Gallery with full-screen viewer, key facts, energy rating, costs, registry record, agent contact |
| Regions | `#/regions`, `#/region/:key` | Country map, comparison table, region pages with captioned photo mosaics |
| Agents | `#/agents`, `#/agent/:slug` | Team grid with office filter, profiles with listings |
| Mortgage calculator | `#/mortgage` | Deals, deposit, term, repayment or interest only, affordability and stress test, yearly chart, cash on completion |
| Blog | `#/blog`, `#/blog/:slug` | Seven market articles by the agents, topic filters |
| Sell, Guides, About, Contact, Saved, Brand | | Valuation estimate, buying and renting rules, company history, office map, brand book |

Light and dark themes follow the system setting and can be switched with the header toggle; the choice, saved homes and list/map view are kept in local storage. Forms work on the page but send nothing.

## Credits

- Photography from [Unsplash](https://unsplash.com), used under the [Unsplash License](https://unsplash.com/license). Portraits are stock photos of real people paired with fictional names; replace them with real staff photos before any real use.
- Fonts from Google Fonts: Bricolage Grotesque, Public Sans, IBM Plex Mono.

Solvenne, Lintel, its agents, listings, prices and laws are all fictional.
