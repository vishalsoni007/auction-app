import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../models/player.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PlayerCardComponent } from '../../shared/player-card/player-card.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PlayerCardComponent, ConfirmDialogModule],
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css'],
  providers: [ConfirmationService]
})
export class AuctionComponent implements OnInit {
  public clubLogo = '../assets/images/fcc-logo.jpg';

  constructor(public playerService: PlayerService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.playerService.loadPlayersFromJson();
  }

  confirmSold() {
    const player = this.playerService.currentPlayer();
    if (!player) return;

    this.confirmationService.confirm({
      message: `Mark ${player.name} as SOLD?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',

      accept: () => {
        this.playerService.markSold();
      }
    });
  }
  
  confirmUnsold() {
    const player = this.playerService.currentPlayer();
    if (!player) return;

    this.confirmationService.confirm({
      message: `Mark ${player.name} as UNSOLD?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',

      accept: () => {
        this.playerService.markUnsold();
      }
    });
  }
}