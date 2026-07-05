import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { NotificationService } from '@core/services/notification.service';
import { NotificationVariant } from '@core/interfaces/notification.interface';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  dismissToast(id: string): void {
    this.notificationService.dismissToast(id);
  }

  dismissAlert(): void {
    this.notificationService.dismissAlert();
  }

  variantIcon(variant: NotificationVariant): string {
    switch (variant) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      default:
        return 'i';
    }
  }
}
