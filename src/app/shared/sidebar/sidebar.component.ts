import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { LocalizationService } from '../../core/services/localization.service';

export type SidebarAction = 'talk' | 'equip' | 'interact' | 'mission' | 'market' | 'craft';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private localization = inject(LocalizationService);

  @Output() action = new EventEmitter<SidebarAction>();

  public readonly menuActions: { id: string; label: string; action: SidebarAction; icon: string }[] = [
    { id: 'talkButton', label: 'talk', action: 'talk', icon: '/assets/icons/talk.svg' },
    { id: 'equipButton', label: 'equip', action: 'equip', icon: '/assets/icons/gear.svg' },
    { id: 'interactButton', label: 'interact', action: 'interact', icon: '/assets/icons/interact.svg' },
    { id: 'missionButton', label: 'mission', action: 'mission', icon: '/assets/icons/mission.svg' },
    { id: 'marketButton', label: 'market', action: 'market', icon: '/assets/icons/market.svg' },
    { id: 'craftingButton', label: 'craft', action: 'craft', icon: '/assets/icons/craft.svg' },
  ];

  readonly getText = this.localization.t.bind(this.localization);

  onAction(actionType: SidebarAction): void {
    this.action.emit(actionType);
  }
}
