import { EquippableItemCategory } from '@core/interfaces/item.interface';

export interface EquipmentSlotDefinition {
  key: EquippableItemCategory;
  labelKey: string;
}

export const EQUIPMENT_SLOT_DEFINITIONS: EquipmentSlotDefinition[] = [
  { key: 'head', labelKey: 'slotHead' },
  { key: 'top', labelKey: 'slotTop' },
  { key: 'bottom', labelKey: 'slotBottom' },
  { key: 'suit', labelKey: 'slotSuit' },
  { key: 'stockings', labelKey: 'slotStockings' },
  { key: 'hands', labelKey: 'slotHands' },
  { key: 'weapon', labelKey: 'slotWeapon' },
  { key: 'bra', labelKey: 'slotBra' },
  { key: 'pantsus', labelKey: 'slotPantsus' },
];
