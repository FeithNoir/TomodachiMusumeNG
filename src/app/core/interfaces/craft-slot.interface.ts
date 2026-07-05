export interface CraftSlotEntry {
  itemId: string;
  requiredQty: number;
}

export type CraftQtyState = 'none' | 'insufficient' | 'exact' | 'surplus';

export interface CraftSlotDisplay {
  entry: CraftSlotEntry | null;
  owned: number;
  state: CraftQtyState;
  label: string;
}

export function resolveCraftQtyState(owned: number, required: number): CraftQtyState {
  if (owned <= 0) {
    return 'none';
  }
  if (owned < required) {
    return 'insufficient';
  }
  if (owned === required) {
    return 'exact';
  }
  return 'surplus';
}

export function formatCraftQtyLabel(owned: number, required: number, state: CraftQtyState): string {
  if (state === 'none') {
    return '0';
  }
  return `${owned}/${required}`;
}
