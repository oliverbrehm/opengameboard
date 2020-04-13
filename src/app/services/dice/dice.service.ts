import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PlayerService } from '../player/player.service';
import { DiceState } from './DiceState';

@Injectable({
  providedIn: 'root'
})
export class DiceService {

  diceStateDoc: AngularFirestoreDocument<DiceState>;
  diceState: DiceState;

  constructor(private firestore: AngularFirestore, private playerService: PlayerService) {

    this.diceState = {
      diceCount: 0,
      inCup: [],
      onTable: [],
      playerName: ""
    };

    this.diceStateDoc = this.firestore.doc('tables/mwD728EWLfKKgqbaiDpH/state/dice');
    this.diceStateDoc.valueChanges().subscribe( diceState => {
      this.diceState = diceState
    });
   }

  increaseDiceCount() {
    if(this.diceState.diceCount >= 12) {
      return
    }

    this.diceState.diceCount++;
    this.resetDices();
  }

  decreaseDiceCount() {
    if(this.diceState.diceCount <= 1) {
      return
    }

    this.diceState.diceCount--;
    this.resetDices();
  }

  resetDices() {
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

    this.diceState.playerName = this.playerService.player.name;

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


  update() {
    this.diceStateDoc.update(this.diceState);
  }
}
