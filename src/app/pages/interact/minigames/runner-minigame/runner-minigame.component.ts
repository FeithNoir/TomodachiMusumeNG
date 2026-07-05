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

interface Obstacle {
  id: number;
  x: number;
}

@Component({
  selector: 'app-runner-minigame',
  standalone: true,
  imports: [],
  templateUrl: './runner-minigame.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './runner-minigame.component.css',
})
export class RunnerMinigameComponent implements OnInit, OnDestroy {
  private localization = inject(LocalizationService);

  participant = input.required<MinigameParticipant>();

  @Output() finished = new EventEmitter<number>();

  readonly getText = this.localization.t.bind(this.localization);

  playerY = signal(0);
  obstacles = signal<Obstacle[]>([]);
  score = signal(0);
  gameOver = signal(false);

  private velocity = 0;
  private nextObstacleId = 0;
  private spawnTimer = 0;
  private elapsed = 0;
  private rafId = 0;
  private lastTimestamp = 0;
  private readonly groundY = 0;
  private readonly gravity = 0.0018;
  private readonly jumpForce = -0.65;
  private readonly stageWidth = 360;
  private readonly playerX = 48;
  private readonly playerSize = 56;

  ngOnInit(): void {
    this.start();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  start(): void {
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      this.jump();
    }
  }

  jump(): void {
    if (this.gameOver()) {
      return;
    }
    if (this.playerY() <= this.groundY + 1) {
      this.velocity = this.jumpForce;
    }
  }

  finish(): void {
    if (this.gameOver()) {
      return;
    }
    this.gameOver.set(true);
    cancelAnimationFrame(this.rafId);
    this.finished.emit(Math.min(100, Math.round(this.score())));
  }

  private loop(timestamp: number): void {
    const delta = Math.min(32, timestamp - this.lastTimestamp);
    this.lastTimestamp = timestamp;

    if (!this.gameOver()) {
      this.tick(delta);
    }

    this.rafId = requestAnimationFrame(ts => this.loop(ts));
  }

  private tick(delta: number): void {
    this.elapsed += delta;
    this.score.set(Math.floor(this.elapsed / 100));
    this.spawnTimer += delta;

    if (this.spawnTimer > 1400 - Math.min(800, this.elapsed / 20)) {
      this.spawnTimer = 0;
      this.obstacles.update(list => [
        ...list,
        { id: this.nextObstacleId++, x: this.stageWidth },
      ]);
    }

    this.velocity += this.gravity * delta;
    const nextY = Math.min(this.groundY, this.playerY() + this.velocity * delta);
    this.playerY.set(nextY);
    if (nextY >= this.groundY) {
      this.velocity = 0;
    }

    const speed = 0.22 + this.elapsed / 60000;
    const updated: Obstacle[] = [];
    let hit = false;

    for (const obstacle of this.obstacles()) {
      const nextX = obstacle.x - speed * delta;
      if (nextX < -40) {
        continue;
      }

      const playerBottom = 72 - this.playerY();
      const obstacleLeft = nextX;
      const obstacleRight = nextX + 28;
      const playerRight = this.playerX + this.playerSize - 8;
      const playerLeft = this.playerX + 8;

      if (
        playerBottom < 36 &&
        obstacleRight > playerLeft &&
        obstacleLeft < playerRight
      ) {
        hit = true;
      }

      updated.push({ ...obstacle, x: nextX });
    }

    this.obstacles.set(updated);

    if (hit) {
      this.gameOver.set(true);
      this.finished.emit(Math.min(100, Math.round(this.score())));
    }
  }
}
