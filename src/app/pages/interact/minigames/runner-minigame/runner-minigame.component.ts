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
import { MinigameService } from '@core/services/minigame.service';
import { MinigameSpriteComponent } from '@shared/minigame-sprite/minigame-sprite.component';

interface Obstacle {
  id: number;
  x: number;
}

export type RunnerDefeatReason = 'collision' | 'stamina';

@Component({
  selector: 'app-runner-minigame',
  standalone: true,
  imports: [MinigameSpriteComponent],
  templateUrl: './runner-minigame.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './runner-minigame.component.css',
})
export class RunnerMinigameComponent implements OnInit, OnDestroy {
  private localization = inject(LocalizationService);
  private minigameService = inject(MinigameService);

  participant = input.required<MinigameParticipant>();

  @Output() finished = new EventEmitter<number>();

  readonly getText = this.localization.t.bind(this.localization);
  readonly highScore = this.minigameService.runnerHighScore;

  jumpHeight = signal(0);
  obstacles = signal<Obstacle[]>([]);
  meters = signal(0);
  stamina = signal(100);
  gameOver = signal(false);
  defeatReason = signal<RunnerDefeatReason | null>(null);

  private velocity = 0;
  private nextObstacleId = 0;
  private spawnTimer = 0;
  private elapsed = 0;
  private distancePx = 0;
  private rafId = 0;
  private lastTimestamp = 0;
  private readonly gravity = 0.0022;
  private readonly jumpForce = 0.72;
  private readonly maxJumpHeight = 90;
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
    if (this.jumpHeight() <= 1) {
      this.velocity = this.jumpForce;
      this.stamina.update(v => Math.max(0, v - 3));
    }
  }

  defeatReasonLabel(): string {
    const reason = this.defeatReason();
    if (reason === 'collision') {
      return this.getText('runnerDefeatCollision');
    }
    if (reason === 'stamina') {
      return this.getText('runnerDefeatStamina');
    }
    return '';
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
    this.spawnTimer += delta;

    const speed = 0.22 + this.elapsed / 60000;
    this.distancePx += speed * delta;
    this.meters.set(Math.floor(this.distancePx / 8));

    this.stamina.update(v => Math.max(0, v - delta * 0.012));
    if (this.stamina() <= 0) {
      this.endRun('stamina');
      return;
    }

    if (this.spawnTimer > 1400 - Math.min(800, this.elapsed / 20)) {
      this.spawnTimer = 0;
      this.obstacles.update(list => [
        ...list,
        { id: this.nextObstacleId++, x: this.stageWidth },
      ]);
    }

    this.velocity -= this.gravity * delta;
    let nextHeight = this.jumpHeight() + this.velocity * delta;
    if (nextHeight <= 0) {
      nextHeight = 0;
      this.velocity = 0;
    }
    if (nextHeight > this.maxJumpHeight) {
      nextHeight = this.maxJumpHeight;
      this.velocity = 0;
    }
    this.jumpHeight.set(nextHeight);

    const updated: Obstacle[] = [];
    let hit = false;

    for (const obstacle of this.obstacles()) {
      const nextX = obstacle.x - speed * delta;
      if (nextX < -40) {
        continue;
      }

      const onGround = this.jumpHeight() < 8;
      const obstacleLeft = nextX;
      const obstacleRight = nextX + 28;
      const playerRight = this.playerX + this.playerSize - 8;
      const playerLeft = this.playerX + 8;

      if (onGround && obstacleRight > playerLeft && obstacleLeft < playerRight) {
        hit = true;
      }

      updated.push({ ...obstacle, x: nextX });
    }

    this.obstacles.set(updated);

    if (hit) {
      this.endRun('collision');
    }
  }

  private endRun(reason: RunnerDefeatReason): void {
    this.gameOver.set(true);
    this.defeatReason.set(reason);
    cancelAnimationFrame(this.rafId);
    this.finished.emit(this.meters());
  }
}
