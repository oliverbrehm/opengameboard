import { Component, OnInit, HostListener } from '@angular/core';
import { PlayerService } from 'src/app/services/player/player.service';
import { TableService } from 'src/app/services/table/table.service';
import { Table } from 'src/app/services/table/Table';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    public playerService: PlayerService,
    public tableService: TableService
  ) { }

  ngOnInit(): void {

  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.playerService.logout();
  }

  enterTable(table: Table) {
    let playerId = this.playerService.currentPlayer.id;
    table.playerIds.push(playerId);
    
    this.tableService.enterTable(table);
  }
}
