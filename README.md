# 🎨 Tomodachi Musume Ng

An anime-style virtual pet game built with **Angular 22** and optional **Electron** desktop packaging. Care for **Eleanora** in her barracks room — talk, equip outfits, feed her, send her on missions, craft gear, and trade at the market. Game state persists to `localStorage` in the browser or SQLite when running as a desktop app.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/FeithNoir/TomodachiMusume/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/FeithNoir/TomodachiMusume)](https://github.com/FeithNoir/TomodachiMusume/issues)

## ✨ Features

* **Layered Character System**: Eleanora's appearance is dynamically rendered using a layer system, with normalized expression paths and automatic blinking.
* **Dynamic Reactions**: Click reactions change expression and dialogue based on affinity tiers.
* **Persistent Data**: Auto-save via signals; browser `localStorage` or Electron SQLite.
* **Localization**: Spanish and English through `LocalizationService` + `UI_STRINGS`.
* **In-game Notifications**: Toast stack and modal alerts via `NotificationService` (SweetAlert-style UX, pure CSS).
* **Equipment Panel**: Row layout with slot grid, `StatBarComponent` (base/low/medium/high tiers), endurance-linked energy cap, and inventory shortcut to equip.
* **Inventory Panel**: Gold header, tabs (all/consumables/materials/recipes/armor by set), equipped indicator dot, equip mode from gear panel.
* **Stat bars**: Shared `StatBarComponent` — white base, red/yellow/green bonus tiers.
* **Game events**: `GameEventService` (master bus) + `AffinityEventService` (affinity thresholds).
* **Crafting**: Recipe book modal with quantity badges (0/insufficient/exact/surplus) on workbench slots.
* **Core HUD Stats**: Affinity, money, energy, and satiety pills.
* **Main Actions**:
  * 🗣️ **Talk** — affinity dialogues.
  * ⚔️ **Gear** — equipment slots + combat stats.
  * 🎒 **Bag** — inventory with gold, recipes, armor sets, equip mode.
  * 🤝 **Interact** — feeding (planned expansion).
* **Mission Board**: Difficulty tiers (common→legendary) with duration/color, stat gates, random & conditional events; assign character or pets.
* **Pets**: Hatch from mission egg rewards (emoji visuals, swappable to images); stats via training/food/potions; slot cap expandable in shop.
* **Away state**: Character hidden on mission; talk/gear/interact disabled until return.
  * 🛠️ **Craft** — material combinations.
  * 🛒 **Market** — buy/sell with toast feedback.
* **Responsive Design**: Mobile dock + desktop grid shell.
* **Pure CSS**: Design tokens in `src/styles.css`; feature layout in co-located CSS.

## 📊 Feature Progress

Indicador por área del juego — útil para priorizar el roadmap:

| Área | Estado | Progreso | Próximo paso sugerido |
| :--- | :--- | :--- | :--- |
| **Companion core** (layers, blink, reactions) | 🟢 Activo | **88%** | Más expresiones contextuales (misiones, craft) |
| **Persistence & save** | 🟢 Activo | **85%** | Detección de save en Electron + import/export JSON |
| **Localization (i18n)** | 🟢 Activo | **95%** | Diálogos dinámicos restantes |
| **Notifications** | 🟢 Activo | **85%** | Confirmaciones destructivas con alert modal |
| **Equipment & stats** | 🟢 Activo | **88%** | Comparativa antes/después al equipar |
| **Inventory & filters** | 🟢 Activo | **90%** | Orden por nombre/cantidad |
| **Crafting** | 🟡 En curso | **82%** | Múltiples recetas simultáneas; preview de resultado |
| **Market** | 🟡 En curso | **70%** | Preview de stats al comprar armas/armaduras |
| **Missions** | 🟢 Activo | **85%** | UI de mascotas en cuartel; entrenamiento/comida |
| **Interact / feeding** | 🔴 Pendiente | **25%** | UI de comida y efectos de saciedad |
| **Story progression** | 🔴 Pendiente | **15%** | Diálogos desbloqueables por afinidad |
| **Minigames** | 🔴 Pendiente | **0%** | Primer minijuego de afinidad |
| **Gallery** | 🔴 Placeholder | **5%** | Galería de CG / outfits desbloqueados |
| **Backend / cloud** | 🔴 Futuro | **0%** | API de saves |

**Leyenda:** 🟢 usable · 🟡 parcial · 🔴 no iniciado o stub

## 📐 Project Guidelines

| Document | Scope |
| :--- | :--- |
| `architecture_guidelines.md` | Folder layout, services, routing, state, persistence, Angular conventions. |
| `design_guidelines.md` | CSS tokens, global classes, notifications, equipment/inventory UI patterns. |

*(Local reference — gitignored in this repo.)*

## 🚀 Project Roadmap

### Planned Features & Enhancements

- [ ] **Minigames** — boost affinity through playable mini-games.
- [x] **Recipe Book** — modal on workbench with unlocked recipes and slot fill.
- [ ] **Advanced Crafting** — craft multiple output units per recipe.
- [ ] **Story Progression** — main storyline dialogues unlocked by affinity.
- [ ] **Data Management** — import/export save data as JSON.
- [ ] **Interact expansion** — full feeding UI tied to satiety.
- [ ] **Stat tooltips** — item comparison when hovering gear in the equipment panel.

### Future Integrations

- [ ] **Backend & Database** — cloud saves for cross-device play.

## 🛠️ Installation & Usage

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
npm run electron:build     # Web build + portable Electron app
```

## 📁 Project Structure

```text
TomodachiMusumeNg/
├── electron/
├── public/assets/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── constants/    # UI_STRINGS
│   │   │   ├── data/         # Databases, balance, initial state
│   │   │   ├── interfaces/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── pages/
│   │   └── shared/           # character, equipment, inventory, notification…
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
| `@assets/*` | `public/assets/*` |

## 🤝 Contributing

Read `architecture_guidelines.md` and `design_guidelines.md` before opening a PR.

## 📄 License

MIT — see [LICENSE](./LICENSE).

## 👨‍💻 Author

* **Feith Noir** — [GitHub](https://github.com/FeithNoir)
