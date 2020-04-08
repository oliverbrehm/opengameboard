import { Component, HostListener } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

interface Room {
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

  playerName = 'Anonymous';

  roomDoc: AngularFirestoreDocument<Room>
  room: Room;

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

    this.room = {
      notes: ""
    }
  }

  ngOnInit() {
    this.diceStateDoc = this.firestore.doc('rooms/mwD728EWLfKKgqbaiDpH/state/dice');
    this.diceStateDoc.valueChanges().subscribe( diceState => {
      this.diceState = diceState
    });

    this.roomDoc = this.firestore.doc('rooms/mwD728EWLfKKgqbaiDpH');
    this.roomDoc.valueChanges().subscribe( room => {
      this.room = room;
    });

    this.playersCollection = this.firestore.collection('rooms/mwD728EWLfKKgqbaiDpH/players');
    this.playersCollection.valueChanges().subscribe( players => {
      this.players = players;
    });

    //this.changePlayerName();

    this.playersCollection.add({name: this.playerName}).then( docRef => {
      this.playerDoc = this.firestore.doc(docRef);
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeunloadHandler(event) {
    this.playerDoc.delete();
  }

  textareaChanged() {
    this.roomDoc.update(this.room);
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
      this.playerName = "Anonymous"
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
