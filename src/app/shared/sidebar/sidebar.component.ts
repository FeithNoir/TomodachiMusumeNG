import { Component, inject, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { LocalizationService } from '@core/services/localization.service';

export type SidebarAction = 'talk' | 'equipment' | 'inventory' | 'interact' | 'mission' | 'market' | 'craft';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private localization = inject(LocalizationService);

  @Input() disabledActions: SidebarAction[] = [];
  @Output() action = new EventEmitter<SidebarAction>();

  public readonly menuActions: {
    id: string;
    label: string;
    action: SidebarAction;
    icon?: string;
    iconEmoji?: string;
  }[] = [
    { id: 'talkButton', label: 'talk', action: 'talk', icon: '/assets/icons/talk.svg' },
    { id: 'equipmentButton', label: 'equipment', action: 'equipment', icon: '/assets/icons/gear.svg' },
    { id: 'inventoryButton', label: 'inventory', action: 'inventory', icon: '/assets/icons/inventory.svg' },
    { id: 'interactButton', label: 'interact', action: 'interact', icon: '/assets/icons/interact.svg' },
    { id: 'missionButton', label: 'mission', action: 'mission', icon: '/assets/icons/mission.svg' },
    { id: 'marketButton', label: 'market', action: 'market', icon: '/assets/icons/market.svg' },
    { id: 'craftingButton', label: 'craft', action: 'craft', icon: '/assets/icons/craft.svg' },
  ];

  readonly getText = this.localization.t.bind(this.localization);

  isDisabled(action: SidebarAction): boolean {
    return this.disabledActions.includes(action);
  }

  onAction(actionType: SidebarAction): void {
    if (this.isDisabled(actionType)) {
      return;
    }
    this.action.emit(actionType);
  }
}
