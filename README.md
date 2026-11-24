<p align="center"><img src="images/logo.png" alt="Pathway Quiz" width="440"></p>

Learn metabolic pathways by building them. Each pathway is a flow chart of reactions. Fill in the molecules, enzymes and cofactors of every step and watch the map grow.

<p align="center"><img src="images/menu.png" alt="The menu" width="820"></p>

## Play

Open `index.html` directly in any browser (works offline via `file://` or deployed statically on GitHub Pages) — no download, no bundler, no install required.

1. **Pick a pathway.** Core pathways across 6 categories (including Lipid biosynthesis & regulation, Carbohydrates, TCA, ETC, Amino acids, and Mitochondrial dynamics), or Everything for combined maps.
2. **Pick a way to play.** *Build* asks one question at a time and grows the map. *Fill the Map* is a blank map with six choices per blank. *Fill in the Blank* is a blank map where you type every answer. The Cofactors switch leaves out ATP, water and the other cofactors when you only want the molecules and enzymes.
3. **Start.** Hint gives a clue. Reveal shows the answer and counts as a miss. After a miss the game tells you why, and once you keep missing the same steps, Practice weak steps quizzes you on just those.

<p align="center"><img src="images/map.png" alt="A finished TCA cycle map" width="820"></p>

Also on the menu: an ATP Calculator, Draw molecules, where you finish or draw the structures, and Quizzes, where you compare two look-alike enzymes or molecules side by side and step through a mechanism one move at a time. Settings has a light and a dark theme (or Auto, which follows your device). The Advanced button at the bottom of the menu turns on photosynthesis, cell signaling and nucleotides with quizzes of their own, and Everything then holds every pathway.

<p align="center"><img src="images/phone.png" alt="The menu and a finished map on a phone" width="520"></p>

## Architecture & Project Structure

The app uses plain vanilla JavaScript, SVG, and CSS with zero external runtime dependencies or build step:

- `index.html`: Lightweight entry point (inline theme FOUC guard + ordered `<script defer>` modules).
- `css/main.css`: Theme tokens, layout, and SVG chart styling.
- `js/data/`: Biochemical entities, 2D molecular geometry, pathway definitions, semantic grid composition (`compose()`), ATP & drawing targets.
- `js/games/`: Interactive comparison and walkthrough mini-games.
- `js/packs/`: Optional `advanced` expansion pack (entities, pathways, mini-games).
- `js/engine/`: Slots, fuzzy matching, storage, sound, SVG layout/rendering (`MG.chart`), and quiz engine.
- `js/ui/`: Mode UIs, Hash Router (`#select`, `#quiz/<id>`, `#atp`, `#games`, `#draw`, `#results`), modal lifecycle cleanup, and app bootstrap.
- `tests/`: Automated Headless Chrome CDP UI & gameplay verification suites (`node tests/verify_ui_flows.js`, `node tests/test_all_modes_play.js`).

## Contact

Want a pathway added, interested in collaborating in any way, or just want to talk? Email me at [benjaminellispeterson@gmail.com](mailto:benjaminellispeterson@gmail.com).

## License

Copyright (c) 2026 Benjamin E. Peterson. All rights reserved. Free to use for your own study and for teaching; any other use needs written permission. See [LICENSE](LICENSE).
