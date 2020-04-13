import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PlayerService } from 'src/app/services/player/player.service';
import { DiceService } from 'src/app/services/dice/dice.service';
import { TableService } from 'src/app/services/table/table.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  title = 'OpenGameBoard';

  constructor(
    private router: Router,
    public playerService: PlayerService,
    public diceService: DiceService,
    public tableService: TableService
  ) {
    this.diceService.updateTable()
  }

  ngOnInit() {
    
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeunloadHandler(event) {
    this.tableService.removePlayer(this.playerService.currentPlayer);
    this.playerService.logout();
  }

  get playerName() {
    return this.playerService.currentPlayer.name;
  }

  get diceCount() {
    return this.diceService.diceState.diceCount;
  }

  get table() {
    return this.tableService.currentTable;
  }

  get players() {
    return this.playerService.playersForIds(this.table.playerIds);
  }

  changePlayerName() {
    this.playerService.changePlayerName();
  }

  textareaChanged() {
    this.tableService.update();
  }

  leaveTable() {
    this.tableService.removePlayer(this.playerService.currentPlayer);

    this.router.navigate(["/"]);
  }
}
