import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

interface DiceState {
  number: Number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OpenGameBoard';

  diceStateDoc: AngularFirestoreDocument<DiceState>;
  diceState: DiceState;

  constructor(private firestore: AngularFirestore) {
    this.diceState = {number: 0};
  }

  ngOnInit() {
    this.diceStateDoc = this.firestore.doc('diceState/default');
    this.diceStateDoc.valueChanges().subscribe( diceState => {
      this.diceState = diceState
    });
  }

  rollDice() {
    var number = Math.floor(Math.random() * 6 + 1);
    this.diceStateDoc.update({number: number });
  }
}
