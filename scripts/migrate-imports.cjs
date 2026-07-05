const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

const replacements = [
  [/from '\.\.\/\.\.\/core\//g, "from '@core/"],
  [/from '\.\.\/core\//g, "from '@core/"],
  [/from '\.\.\/\.\.\/shared\//g, "from '@shared/"],
  [/from '\.\.\/shared\//g, "from '@shared/"],
  [/from '\.\.\/shop\//g, "from '@pages/shop/"],
  [/from '\.\.\/mission\//g, "from '@pages/mission/"],
  [/from '\.\.\/tutorial\//g, "from '@pages/tutorial/"],
  [/from '\.\.\/layout\//g, "from '@pages/layout/"],
  [/from '\.\.\/main\//g, "from '@pages/main/"],
  [/from '\.\.\/title\//g, "from '@pages/title/"],
  [/from '\.\.\/interfaces\//g, "from '@core/interfaces/"],
  [/from '\.\.\/data\//g, "from '@core/data/"],
  [/from '\.\.\/constants\//g, "from '@core/constants/"],
  [/from '\.\.\/utils\//g, "from '@core/utils/"],
  [/from '\.\/game-state\.service'/g, "from '@core/services/game-state.service'"],
  [/from '\.\/persistence\.service'/g, "from '@core/services/persistence.service'"],
  [/from '\.\/character\.service'/g, "from '@core/services/character.service'"],
  [/from '\.\/inventory\.service'/g, "from '@core/services/inventory.service'"],
  [/from '\.\/shop\.service'/g, "from '@core/services/shop.service'"],
  [/from '\.\/mission\.service'/g, "from '@core/services/mission.service'"],
  [/from '\.\/crafting\.service'/g, "from '@core/services/crafting.service'"],
  [/from '\.\/localization\.service'/g, "from '@core/services/localization.service'"],
  [/from '\.\/item-catalog\.service'/g, "from '@core/services/item-catalog.service'"],
  [/from '\.\/game-loop\.service'/g, "from '@core/services/game-loop.service'"],
  [/from 'src\/app\/core\//g, "from '@core/"],
  [/from '\.\/item-database'/g, "from '@core/data/item-database'"],
  [/from '\.\/recipe-database'/g, "from '@core/data/recipe-database'"],
  [/from '\.\/shop-data'/g, "from '@core/data/shop-data'"],
  [/from '\.\/dialogue-database'/g, "from '@core/data/dialogue-database'"],
];

const srcDir = path.join(process.cwd(), 'src');
let count = 0;
for (const file of walk(srcDir)) {
  let content = fs.readFileSync(file, 'utf8');
  let updated = content;
  for (const [pattern, replacement] of replacements) {
    updated = updated.replace(pattern, replacement);
  }
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    count++;
    console.log('Updated:', path.relative(process.cwd(), file));
  }
}
console.log('Total updated:', count);
