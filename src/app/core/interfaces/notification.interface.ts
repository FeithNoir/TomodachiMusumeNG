export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  message: string;
  variant: NotificationVariant;
  durationMs: number;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  variant: NotificationVariant;
}

export type EquipFailureReason = 'not_found' | 'not_equippable' | 'insufficient_affinity';

export type EquipResult =
  | { ok: true }
  | { ok: false; reason: EquipFailureReason; requiredAffinity?: number };
