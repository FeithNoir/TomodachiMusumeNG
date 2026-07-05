import {
  Component,
  input,
  Output,
  EventEmitter,
  inject,
  signal,
  OnDestroy,
  OnInit,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MinigameParticipant } from '@core/interfaces/minigame.interface';
import { LocalizationService } from '@core/services/localization.service';
import { MinigameSpriteComponent } from '@shared/minigame-sprite/minigame-sprite.component';

interface BeatMarker {
  id: number;
  y: number;
  hit: boolean;
  missed: boolean;
}

@Component({
  selector: 'app-rhythm-minigame',
  standalone: true,
  imports: [MinigameSpriteComponent],
  templateUrl: './rhythm-minigame.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './rhythm-minigame.component.css',
})
export class RhythmMinigameComponent implements OnInit, OnDestroy {
  private localization = inject(LocalizationService);

  participant = input.required<MinigameParticipant>();

  @Output() finished = new EventEmitter<number>();

  readonly getText = this.localization.t.bind(this.localization);

  markers = signal<BeatMarker[]>([]);
  hits = signal(0);
  misses = signal(0);
  totalBeats = signal(0);
  gameOver = signal(false);
  jumpScale = signal(1);

  readonly maxBeats = 16;

  private nextId = 0;
  private beatsSpawned = 0;
  private readonly hitZoneY = 168;
  private readonly spawnInterval = 1200;
  private spawnTimer: ReturnType<typeof setInterval> | null = null;
  private animTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.spawnTimer = setInterval(() => this.spawnBeat(), this.spawnInterval);
    this.animTimer = setInterval(() => this.tick(), 50);
  }

  ngOnDestroy(): void {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
    }
    if (this.animTimer) {
      clearInterval(this.animTimer);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      this.tryHit();
    }
  }

  tryHit(): void {
    if (this.gameOver()) {
      return;
    }

    const zoneTop = this.hitZoneY - 18;
    const zoneBottom = this.hitZoneY + 18;
    let matched = false;

    this.markers.update(list =>
      list.map(marker => {
        if (matched || marker.hit || marker.missed) {
          return marker;
        }
        if (marker.y >= zoneTop && marker.y <= zoneBottom) {
          matched = true;
          this.hits.update(v => v + 1);
          this.animateJump();
          return { ...marker, hit: true };
        }
        return marker;
      })
    );

    if (!matched) {
      this.misses.update(v => v + 1);
    }
  }

  private spawnBeat(): void {
    if (this.gameOver() || this.beatsSpawned >= this.maxBeats) {
      if (this.spawnTimer) {
        clearInterval(this.spawnTimer);
        this.spawnTimer = null;
      }
      return;
    }

    this.beatsSpawned += 1;
    this.totalBeats.set(this.beatsSpawned);
    this.markers.update(list => [...list, { id: this.nextId++, y: 0, hit: false, missed: false }]);
  }

  private tick(): void {
    if (this.gameOver()) {
      return;
    }

    let pendingFinish = false;

    this.markers.update(list =>
      list.map(marker => {
        if (marker.hit) {
          return marker;
        }
        const nextY = marker.y + 6;
        if (nextY > 220 && !marker.missed) {
          this.misses.update(v => v + 1);
          return { ...marker, y: nextY, missed: true };
        }
        return { ...marker, y: nextY };
      })
    );

    if (this.beatsSpawned >= this.maxBeats) {
      const allDone = this.markers().every(m => m.hit || m.missed || m.y > 220);
      if (allDone) {
        pendingFinish = true;
      }
    }

    if (pendingFinish) {
      this.endGame();
    }
  }

  private animateJump(): void {
    this.jumpScale.set(1.25);
    setTimeout(() => this.jumpScale.set(1), 180);
  }

  private endGame(): void {
    this.gameOver.set(true);
    if (this.animTimer) {
      clearInterval(this.animTimer);
    }
    const total = this.hits() + this.misses();
    const score = total > 0 ? Math.round((this.hits() / this.maxBeats) * 100) : 0;
    this.finished.emit(score);
  }
}
