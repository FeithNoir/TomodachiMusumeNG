# 🎨 Tomodachi Musume Ng

An anime-style virtual pet game built with **Angular 22** and optional **Electron** desktop packaging. Care for **Eleanora** in her barracks room — talk, equip outfits, send missions, craft gear, play minigames, unlock gallery entries, and trade at the market. Game state persists to `localStorage` in the browser or SQLite when running as a desktop app.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/FeithNoir/TomodachiMusume/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/FeithNoir/TomodachiMusume)](https://github.com/FeithNoir/TomodachiMusume/issues)

## ✨ Features

* **Layered Character System**: Dynamic sprite layers, normalized expression paths, automatic blinking.
* **Dynamic Reactions**: Click reactions and affinity-tier dialogue.
* **Persistent Data**: Auto-save via signals; browser `localStorage` or Electron SQLite.
* **Localization**: Spanish and English through `LocalizationService` + `UI_STRINGS`.
* **Equipment & Inventory**: Stat bars, rarity gradients, armor sets, shared catalog filter (search + tabs).
* **Mission Board**: Difficulty tiers, stat gates, character or pet assignees; rewards modal on completion; missions resume after reload.
* **Interact Hub**: Training minigames, affinity date events, experiments placeholder.
* **Gallery**: Unlock outfits (owned items), scenes (completed dates), and affinity memories.
* **Market**: Buy/sell grouped by thematic sets; pet slot and inventory expansions.
* **Crafting**: Recipe book with material quantity badges.
* **Pure CSS**: Design tokens in `src/styles.css`; feature layout in co-located CSS.

## 📦 Item Data Flow

All runtime item operations go through a single catalog. Understanding this flow prevents errors like `Attempted to add non-existent item: wood_sword`.

```text
masterItemList (item-database.ts)
        │
        ├── ItemCatalogService.getItem(id)   ← UI names, paths, rarity
        ├── InventoryService.addItem(id)     ← validates id exists
        ├── ShopService / CraftingService    ← buy, sell, craft
        └── MissionService.applyRewards()    ← loot rolls
```

**Reference sources that must use valid item ids:**

| Source | File | Example |
| :--- | :--- | :--- |
| Craft results | `recipe-database.ts` | `result: 'wooden_sword'` |
| Mission loot | `mission-rewards.config.ts` | `{ type: 'item', id: 'wood_plank' }` |
| Shop listings | `shop-catalog.ts` | set `itemIds` arrays |
| Initial inventory | `initial-game-state.ts` | starter items |

### Fixing “non-existent item” errors

1. **Check spelling** — ids are case-sensitive (`wooden_sword`, not `wood_sword`).
2. **Add the item** to `masterItemList` in `item-database.ts` if it is new content.
3. **Update references** in recipes, missions, or shop sets to match the catalog id.
4. **Run the app in dev** — `assertValidItemRegistry()` in `main.ts` logs broken recipe/mission references at startup.
5. **Optional** — call `findInvalidItemReferences()` from `item-registry.util.ts` in tests or CI.

## 📊 Feature Progress

| Area | Status | Notes |
| :--- | :--- | :--- |
| Companion core | 🟢 Active | Layers, blink, reactions |
| Persistence & save | 🟢 Active | Auto-save; mission autosave on deploy |
| Missions | 🟢 Active | Board, pets, reward modal, offline completion |
| Interact / minigames | 🟢 Active | Training, dates, experiments stub |
| Gallery | 🟢 Active | Outfits, scenes, memories |
| Market | 🟢 Active | Set groups, upgrades, rarity |
| Crafting | 🟡 In progress | Single-recipe craft flow |
| Story progression | 🔴 Planned | Affinity-gated main story |

**Legend:** 🟢 usable · 🟡 partial · 🔴 planned

## 📐 Project Guidelines

| Document | Scope |
| :--- | :--- |
| `architecture_guidelines.md` | Folder layout, services, routing, state, persistence. |
| `design_guidelines.md` | CSS tokens, global classes, UI patterns. |

## 🚀 Installation & Usage

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Web (development)

```bash
git clone https://github.com/FeithNoir/TomodachiMusumeNg.git
cd TomodachiMusumeNg
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Electron (desktop)

With the dev server running:

```bash
npm run electron:serve
```

### Production build

```bash
npm run build              # Web build → dist/tomodachi-musume-ng/
npm run electron:build     # Web build + portable Electron app → dist/electron/
```

## 📁 Project Structure

```text
TomodachiMusumeNg/
├── electron/
├── public/assets/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── data/         # Catalogs, shop sets, gallery, missions
│   │   │   ├── services/     # Game state, missions, gallery, shop…
│   │   │   └── utils/        # item-registry, mission-reward helpers
│   │   ├── pages/            # layout, shop, mission, interact…
│   │   └── shared/           # inventory, gallery, catalog-filter…
│   └── styles.css
├── architecture_guidelines.md
├── design_guidelines.md
└── README.md
```

### Path aliases (`tsconfig.json`)

| Alias | Target |
| :--- | :--- |
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@pages/*` | `src/app/pages/*` |

## 🤝 Contributing

Read `architecture_guidelines.md` and `design_guidelines.md` before opening a PR.

## 📄 License

MIT — see [LICENSE](./LICENSE).

## 👨‍💻 Author

* **Feith Noir** — [GitHub](https://github.com/FeithNoir)
