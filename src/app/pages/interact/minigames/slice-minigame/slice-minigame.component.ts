import {
  Component,
  input,
  Output,
  EventEmitter,
  inject,
  signal,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MinigameParticipant } from '@core/interfaces/minigame.interface';
import { LocalizationService } from '@core/services/localization.service';
import { MinigameSpriteComponent } from '@shared/minigame-sprite/minigame-sprite.component';

interface SliceTarget {
  id: number;
  x: number;
  y: number;
  emoji: string;
  sliced: boolean;
  expiresAt: number;
}

const TARGET_EMOJIS = ['🍎', '🍉', '🎯', '🎋', '⭐'];

@Component({
  selector: 'app-slice-minigame',
  standalone: true,
  imports: [MinigameSpriteComponent],
  templateUrl: './slice-minigame.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slice-minigame.component.css',
})
export class SliceMinigameComponent implements OnInit, OnDestroy {
  private localization = inject(LocalizationService);

  participant = input.required<MinigameParticipant>();

  @Output() finished = new EventEmitter<number>();

  readonly getText = this.localization.t.bind(this.localization);

  targets = signal<SliceTarget[]>([]);
  hits = signal(0);
  misses = signal(0);
  gameOver = signal(false);
  slash = signal(false);

  readonly maxTargets = 15;

  private nextId = 0;
  private spawned = 0;
  private spawnTimer: ReturnType<typeof setInterval> | null = null;
  private tickTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.spawnTimer = setInterval(() => this.spawnTarget(), 900);
    this.tickTimer = setInterval(() => this.tick(), 100);
  }

  ngOnDestroy(): void {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
    }
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
    }
  }

  sliceTarget(id: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.gameOver()) {
      return;
    }

    let found = false;
    this.targets.update(list =>
      list.map(target => {
        if (target.id === id && !target.sliced) {
          found = true;
          this.hits.update(v => v + 1);
          this.slash.set(true);
          setTimeout(() => this.slash.set(false), 120);
          return { ...target, sliced: true };
        }
        return target;
      })
    );

    if (!found) {
      this.misses.update(v => v + 1);
    }
  }

  private spawnTarget(): void {
    if (this.gameOver() || this.spawned >= this.maxTargets) {
      if (this.spawnTimer) {
        clearInterval(this.spawnTimer);
        this.spawnTimer = null;
      }
      return;
    }

    this.spawned += 1;
    const x = 24 + Math.random() * 280;
    const y = 24 + Math.random() * 100;
    const emoji = TARGET_EMOJIS[Math.floor(Math.random() * TARGET_EMOJIS.length)];

    this.targets.update(list => [
      ...list.filter(t => !t.sliced && t.expiresAt > Date.now()),
      {
        id: this.nextId++,
        x,
        y,
        emoji,
        sliced: false,
        expiresAt: Date.now() + 1600,
      },
    ]);
  }

  private tick(): void {
    if (this.gameOver()) {
      return;
    }

    const now = Date.now();
    let expiredCount = 0;

    this.targets.update(list =>
      list.map(target => {
        if (!target.sliced && target.expiresAt <= now) {
          expiredCount += 1;
          return { ...target, sliced: true };
        }
        return target;
      })
    );

    if (expiredCount > 0) {
      this.misses.update(v => v + expiredCount);
    }

    if (this.spawned >= this.maxTargets) {
      const active = this.targets().some(t => !t.sliced && t.expiresAt > now);
      if (!active) {
        this.endGame();
      }
    }
  }

  private endGame(): void {
    this.gameOver.set(true);
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
    }
    const score = Math.round((this.hits() / this.maxTargets) * 100);
    this.finished.emit(score);
  }
}
