# 🎨 Tomodachi Musume - Advanced Prototype

An advanced prototype of an anime-girl virtual pet game, blending Tamagotchi-style care mechanics with RPG elements like crafting, missions, and character progression. This project serves as a feature-rich demonstration of the core gameplay loops.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/FeithNoir/TomodachiMusume/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/FeithNoir/TomodachiMusume)](https://github.com/FeithNoir/TomodachiMusume/issues)

## ✨ Features

This prototype allows the player to interact with **Eleanora**, a special companion in her room/barracks. The implemented features are extensive and create a compelling gameplay loop:

*   **Layered Character System**: Eleanora's appearance is dynamically rendered using a layer system, allowing for seamless equipment and expression changes.
*   **Dynamic Reactions**: Eleanora reacts to clicks with different expressions and dialogue based on her current affinity level, making her feel more alive.
*   **Persistent Data**: The game state, including player name, progress, and inventory, is automatically saved to the browser's `localStorage`, allowing players to continue their game later.
*   **i18n Support**: Full internationalization for Spanish and English, with language selection during the intro and in the options menu.
*   **Core Stats System**:
    *   **Affinity**: Influenced by dialogues and actions, unlocking new interactions and equipment.
    *   **Energy**: Consumed by missions and passively regenerated over time.
    *   **Satiety**: Decreases over time and is restored by feeding, creating a resource management cycle.
*   **Main Actions**:
    *   🗣️ **Talk**: Engage in dynamic conversations where Eleanora addresses the player by different nicknames based on affinity.
    *   👕 **Equip**: Manage a full equipment system with slots for `top`, `bottom`, `suit`, `head`, and `weapon`.
    *   🤝 **Interact**: Feed Eleanora to restore her energy, affecting her satiety level.
    *   ⚔️ **Mission**: Send Eleanora on missions. Success rates and loot quality are influenced by her equipped weapon.
    *   🛠️ **Crafting**: A complete crafting system where players can combine materials to create new items, such as powerful equipment.
    *   🛒 **Market**: A two-way marketplace to buy new items, materials, and recipes, or sell surplus goods for money.
*   **Responsive Design**: The UI seamlessly adapts from desktop to mobile layouts.

## 🚀 Project Roadmap

This prototype has laid a strong foundation, but there's always more to build!

### Planned Features & Enhancements
- [ ] **Minigames**: Implement the "Play Minigame" feature to boost affinity.
- [ ] **Consumable Items**: Add functionality to use items like the Energy Drink directly from the inventory.
- [ ] **Recipe Book**: Create a UI for the recipe book so players can view known recipes.
- [ ] **Advanced Crafting**: Allow using more than one of each material in the crafting slots.
- [ ] **Story Progression**: Expand the dialogue system with a main storyline that unfolds as affinity grows.
- [ ] **Data Management**: Add options to import/export save data as a JSON file.

### Future Integrations
- [ ] **Backend & Database**: Migrate from `localStorage` to a proper backend service (like Firebase) to allow cross-device play.
- [ ] **Framework Migration**: Plan the migration of this vanilla JS prototype to a modern framework like **Angular** for better scalability and maintainability.
- [ ] **Desktop App**: Explore wrapping the web app with **Electron** for a standalone desktop version.

## 🛠️ Installation & Usage

To run this project locally, simply clone the repository or download the files.

1.  Clone the project:
    ```bash
    git clone https://github.com/FeithNoir/TomodachiMusume.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd TomodachiMusume
    ```
3.  Open the `index.html` file in your favorite web browser.

The required file structure is:
```
TomodachiMusume/
├── index.html
├── style.css
├── main.js
├── README.md
├── LICENSE
└── img/
    ├── character/
    ├── expressions/
    ├── items/
    └── ... (etc.)
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

*   **Feith Noir** - [GitHub](https://github.com/FeithNoir)
