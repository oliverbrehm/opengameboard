import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OpenGameBoard';

  currentNumber = 1;

  rollDice() {
    this.currentNumber = Math.floor(Math.random() * 6 + 1);
  }
}
