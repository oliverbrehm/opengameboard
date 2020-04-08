import { Component, HostListener } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

interface Table {
  notes: String;
}

interface DiceState {
  diceCount: number;
  inCup: Array<Number>;
  onTable: Array<Number>;
  playerName: String;
}

interface Player {
  name: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OpenGameBoard';

  playerName = 'Anonym';

  tableDoc: AngularFirestoreDocument<Table>
  table: Table;

  playersCollection: AngularFirestoreCollection<Player>;
  players: Array<Player>;
  playerDoc: AngularFirestoreDocument<Player>;
  player: Player;

  diceStateDoc: AngularFirestoreDocument<DiceState>;
  diceState: DiceState;

  constructor(private firestore: AngularFirestore) {
    this.diceState = {
      diceCount: 0,
      inCup: [],
      onTable: [],
      playerName: ""
    };

    this.table = {
      notes: ""
    }
  }

  ngOnInit() {
    this.diceStateDoc = this.firestore.doc('tables/mwD728EWLfKKgqbaiDpH/state/dice');
    this.diceStateDoc.valueChanges().subscribe( diceState => {
      this.diceState = diceState
    });

    this.tableDoc = this.firestore.doc('tables/mwD728EWLfKKgqbaiDpH');
    this.tableDoc.valueChanges().subscribe( table => {
      this.table = table;
    });

    this.playersCollection = this.firestore.collection('tables/mwD728EWLfKKgqbaiDpH/players');
    this.playersCollection.valueChanges().subscribe( players => {
      this.players = players;
    });

    this.changePlayerName();

    this.playersCollection.add({name: this.playerName}).then( docRef => {
      this.playerDoc = this.firestore.doc(docRef);
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeunloadHandler(event) {
    this.playerDoc.delete();
  }

  textareaChanged() {
    this.tableDoc.update(this.table);
  }

  increaseDiceCount() {
    if(this.diceState.diceCount >= 12) {
      return
    }

    this.diceState.diceCount++;
    this.updateDices();
  }

  decreaseDiceCount() {
    if(this.diceState.diceCount <= 1) {
      return
    }

    this.diceState.diceCount--;
    this.updateDices();
  }

  updateDices() {
    let inCup = [];
    for(var i = 0; i < this.diceState.diceCount; i++) {
      inCup.push(0);
    }

    this.diceState = {
      diceCount: this.diceState.diceCount,
      inCup: inCup,
      onTable: [],
      playerName: ""
    }
    this.update();
  }

  putInCup(dice: Number) {
    let toRemove = this.diceState.onTable.indexOf(dice);

    if(toRemove >= 0) {
      this.diceState.onTable.splice(toRemove, 1);
      this.diceState.inCup.push(dice);
    }

    this.update();
  }

  putAllDicesInCup() {
    this.diceState.inCup = this.diceState.inCup.concat(this.diceState.onTable);
    this.diceState.onTable = [];
    this.update();
  }

  rollDicesInCup() {
    if(this.diceState.inCup.length < 1) {
      return;
    }

    this.diceState.playerName = this.playerName;

    let inCupCount = this.diceState.inCup.length;
    let onTable = this.diceState.onTable;

    for(var i = 0; i < inCupCount; i++) {
      onTable.push(this.rollDice());
    }

    this.diceState.onTable = onTable;
    this.diceState.inCup = [];

    this.update();
  }

  rollDice() : Number {
    return Math.floor(Math.random() * 6 + 1);;
  }

  changePlayerName() {
    let name = prompt("What's your name?");
    if(name.length > 0) {
      this.playerName = name;
    } else {
      this.playerName = "Anonym"
    }

    if(this.playerDoc) {
      this.playerDoc.update({name: name});
    }
  }

  removePlayer(player: Player) {
    // TODO remove player from db
  }

  update() {
    this.diceStateDoc.update(this.diceState);
  }
}
