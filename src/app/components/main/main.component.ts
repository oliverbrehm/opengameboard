import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player/player.service';
import { TableService } from 'src/app/services/table/table.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private playerService: PlayerService,
    private tableService: TableService
  ) { }

  ngOnInit(): void {

  }
}
