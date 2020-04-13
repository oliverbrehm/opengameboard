import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PlayerService } from 'src/app/services/player/player.service';
import { DiceService } from 'src/app/services/dice/dice.service';
import { TableService } from 'src/app/services/table/table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  title = 'OpenGameBoard';

  constructor(
    private playerService: PlayerService,
    private diceService: DiceService,
    private tableService: TableService
  ) {
    this.diceService.updateTable()
  }

  ngOnInit() {
    
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeunloadHandler(event) {
    this.playerService.logout();
  }

  get playerName() {
    return this.playerService.player.name;
  }

  get diceCount() {
    return this.diceService.diceState.diceCount;
  }

  changePlayerName() {
    this.playerService.changePlayerName();
  }

  textareaChanged() {
    this.tableService.updateNotes();
  }
}
