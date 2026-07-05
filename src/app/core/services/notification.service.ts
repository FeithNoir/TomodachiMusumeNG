import { Injectable, signal } from '@angular/core';
import {
  AlertNotification,
  NotificationVariant,
  ToastNotification,
} from '@core/interfaces/notification.interface';

let nextNotificationId = 0;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toasts = signal<ToastNotification[]>([]);
  private alertState = signal<AlertNotification | null>(null);
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toastList = this.toasts.asReadonly();
  readonly alert = this.alertState.asReadonly();

  toast(message: string, variant: NotificationVariant = 'info', durationMs = 3_500): void {
    const id = this.createId();
    const toastEntry: ToastNotification = { id, message, variant, durationMs };
    this.toasts.update(list => [...list, toastEntry]);

    const timer = setTimeout(() => this.dismissToast(id), durationMs);
    this.timers.set(id, timer);
  }

  success(message: string, durationMs = 3_500): void {
    this.toast(message, 'success', durationMs);
  }

  error(message: string, durationMs = 4_500): void {
    this.toast(message, 'error', durationMs);
  }

  warning(message: string, durationMs = 4_000): void {
    this.toast(message, 'warning', durationMs);
  }

  info(message: string, durationMs = 3_500): void {
    this.toast(message, 'info', durationMs);
  }

  showAlert(title: string, message: string, variant: NotificationVariant = 'info'): void {
    this.alertState.set({
      id: this.createId(),
      title,
      message,
      variant,
    });
  }

  dismissToast(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toasts.update(list => list.filter(entry => entry.id !== id));
  }

  dismissAlert(): void {
    this.alertState.set(null);
  }

  private createId(): string {
    nextNotificationId += 1;
    return `notification-${nextNotificationId}`;
  }
}
