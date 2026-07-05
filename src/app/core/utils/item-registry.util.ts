import { masterItemList } from '@core/data/item-database';
import { recipes } from '@core/data/recipe-database';
import { MISSION_REWARD_TABLES } from '@core/data/mission-rewards.config';

export interface ItemReferenceIssue {
  source: string;
  itemId: string;
  hint?: string;
}

/** Collects broken item id references across static game data. */
export function findInvalidItemReferences(): ItemReferenceIssue[] {
  const issues: ItemReferenceIssue[] = [];
  const validIds = new Set(Object.keys(masterItemList));

  for (const [recipeId, recipe] of Object.entries(recipes)) {
    if (!validIds.has(recipe.result)) {
      issues.push({
        source: `recipe-database:${recipeId}`,
        itemId: recipe.result,
        hint: 'Recipe result must exist in masterItemList (check id spelling).',
      });
    }
    for (const ingredient of recipe.ingredients) {
      if (!validIds.has(ingredient.id)) {
        issues.push({
          source: `recipe-database:${recipeId}`,
          itemId: ingredient.id,
          hint: 'Recipe ingredient must exist in masterItemList.',
        });
      }
    }
  }

  for (const table of Object.values(MISSION_REWARD_TABLES)) {
    for (const entry of table.entries) {
      if (entry.type === 'item' && entry.id && !validIds.has(entry.id)) {
        issues.push({
          source: `mission-rewards:${table.id}`,
          itemId: entry.id,
          hint: 'Mission loot item must exist in masterItemList.',
        });
      }
    }
  }

  return issues;
}

export function assertValidItemRegistry(): void {
  const issues = findInvalidItemReferences();
  if (issues.length === 0) {
    return;
  }

  const details = issues
    .map(issue => `  • ${issue.source} → "${issue.itemId}"${issue.hint ? ` (${issue.hint})` : ''}`)
    .join('\n');

  console.error(`Invalid item references detected:\n${details}`);
}
