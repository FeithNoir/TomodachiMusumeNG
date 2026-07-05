# 🎨 Tomodachi Musume Ng

An anime-style virtual pet game built with **Angular 22** and optional **Electron** desktop packaging. Care for **Eleanora** in her barracks room — talk, equip outfits, feed her, send her on missions, craft gear, and trade at the market. Game state persists to `localStorage` in the browser or SQLite when running as a desktop app.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/FeithNoir/TomodachiMusume/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/FeithNoir/TomodachiMusume)](https://github.com/FeithNoir/TomodachiMusume/issues)

## ✨ Features

* **Layered Character System**: Eleanora's appearance is dynamically rendered using a layer system, allowing seamless equipment and expression changes.
* **Dynamic Reactions**: Eleanora reacts to clicks with different expressions and dialogue based on her current affinity level.
* **Persistent Data**: Game state (player name, stats, inventory, equipment) auto-saves to `localStorage` or Electron SQLite.
* **i18n Support**: Spanish and English via the `LocalizedText` pattern; language selectable on the title screen and in options.
* **Core Stats System**:
  * **Affinity** — influenced by dialogues and actions; unlocks equipment and interactions.
  * **Energy** — consumed by missions; passively regenerates over time.
  * **Satiety** — decreases over time; restored by feeding.
* **Main Actions**:
  * 🗣️ **Talk** — dynamic conversations with affinity-based nicknames.
  * 👕 **Equip** — slots for `top`, `bottom`, `suit`, `head`, `weapon`, and more.
  * 🤝 **Interact** — feed Eleanora to restore energy and manage satiety.
  * ⚔️ **Mission** — send Eleanora on missions; success and loot depend on equipped gear.
  * 🛠️ **Crafting** — combine materials to create new items.
  * 🛒 **Market** — buy and sell items, materials, and recipes.
* **Responsive Design**: Mobile-first HUD with a bottom action dock; desktop layout uses a grid shell with a vertical sidebar.
* **Pure CSS styling**: No Tailwind — all UI uses design tokens and component styles in `src/styles.css` and co-located `*.component.css` files.

## 📐 Project Guidelines

Contributors and AI collaborators should follow these documents before adding features or UI. These files live in the project root for local reference (gitignored):

| Document | Scope |
| :--- | :--- |
| `architecture_guidelines.md` | Folder layout, services, routing, state management, persistence, Angular conventions. |
| `design_guidelines.md` | CSS tokens in `src/styles.css`, global classes, responsive layout, component visual patterns. |

## 🚀 Project Roadmap

### Planned Features & Enhancements

- [ ] **Minigames** — boost affinity through playable mini-games.
- [ ] **Consumable Items** — use items like Energy Drink directly from inventory.
- [ ] **Recipe Book** — UI to browse known crafting recipes.
- [ ] **Advanced Crafting** — allow multiple units of each material per slot.
- [ ] **Story Progression** — main storyline dialogues unlocked by affinity.
- [ ] **Data Management** — import/export save data as JSON.
- [ ] **Toast Notifications** — implement `NotificationService` for in-game feedback.

### Future Integrations

- [ ] **Backend & Database** — cloud saves for cross-device play.
- [ ] **Centralized i18n** — extract scattered `LocalizedText` maps into a shared strings module.

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
├── electron/                 # Electron main process & SQLite persistence
├── public/assets/
│   ├── icons/                # SVG HUD and action icons
│   └── img/                  # Character layers, items, backgrounds
├── src/
│   ├── app/
│   │   ├── core/             # Data, interfaces, services
│   │   ├── pages/            # Title, layout shell, main view, modals
│   │   └── shared/           # Character, sidebar, inventory, dialogue…
│   └── styles.css            # Design tokens & global UI classes (pure CSS)
├── architecture_guidelines.md  # Local only (gitignored)
├── design_guidelines.md        # Local only (gitignored)
└── README.md
```

## 🤝 Contributing

Contributions are welcome. Please read `architecture_guidelines.md` and `design_guidelines.md` (local, gitignored) before opening a PR.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## 👨‍💻 Author

* **Feith Noir** — [GitHub](https://github.com/FeithNoir)
