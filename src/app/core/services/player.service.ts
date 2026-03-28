import { Injectable, signal, computed, inject } from '@angular/core';
import { Player } from '../../models/player.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private allPlayers = signal<Player[]>([]);
  private http = inject(HttpClient);
  remainingPlayers = signal<Player[]>([]);
  soldPlayers = signal<Player[]>([]);
  unsoldPlayers = signal<Player[]>([]);
  currentPlayer = signal<Player | null>(null);

  round = signal<1 | 2>(1);

  // Counters
  totalCount = computed(() => this.allPlayers().length);
  soldCount = computed(() => this.soldPlayers().length);
  unsoldCount = computed(() => this.unsoldPlayers().length);

  loadPlayers(data: Player[]) {
    this.allPlayers.set(data);
    this.remainingPlayers.set([...data]);
  }

  getRandomPlayer() {
    const players = this.remainingPlayers();
    if (!players.length) {
      this.currentPlayer.set(null);
      return;
    }

    const index = Math.floor(Math.random() * players.length);
    this.currentPlayer.set(players[index]);
  }

  markSold() {
    const player = this.currentPlayer();
    if (!player) return;

    this.soldPlayers.update(p => [...p, player]);
    this.removeFromRemaining(player.id);
    setTimeout(() => {
      this.getRandomPlayer();
    }, 300);
  }

  markUnsold() {
    const player = this.currentPlayer();
    if (!player) return;

    this.unsoldPlayers.update(p => [...p, player]);
    this.removeFromRemaining(player.id);
    setTimeout(() => {
      this.getRandomPlayer();
    }, 300);
  }

  private removeFromRemaining(id: number) {
    this.remainingPlayers.update(players =>
      players.filter(p => p.id !== id)
    );
  }

  canStartRound2() {
    return this.remainingPlayers().length === 0 && this.round() === 1;
  }

  startRound2() {
    this.remainingPlayers.set([...this.unsoldPlayers()]);
    this.unsoldPlayers.set([]);
    this.round.set(2);
  }


  loadPlayersFromJson() {
    this.http.get<Player[]>('assets/data/player.json')
      .subscribe(data => {
        this.allPlayers.set(data);
        this.remainingPlayers.set([...data]);
      });
  }
}