import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {

  }
}
