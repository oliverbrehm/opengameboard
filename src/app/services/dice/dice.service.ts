import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PlayerService } from '../player/player.service';
import { DiceState } from './DiceState';
import { TableService } from '../table/table.service';

@Injectable({
  providedIn: 'root'
})
export class DiceService {

  diceStateDoc: AngularFirestoreDocument<DiceState>;
  diceState: DiceState;

  constructor(
    private firestore: AngularFirestore, 
    private playerService: PlayerService,
    private tableService: TableService
  ) {
    this.diceState = this.clearState();
   }

   updateTable() {
     if(this.tableService.currentTableSnapshot) { 
      this.diceStateDoc = this.firestore.doc('tables/' + this.tableService.currentTableSnapshot.id + '/state/dice');
      this.diceStateDoc.valueChanges().subscribe( diceState => {
        this.diceState = diceState
      });
     } else {
      this.diceState = this.clearState();
     }
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

  clearState(): DiceState {
    return {
      diceCount: 1,
      inCup: [1],
      onTable: [],
      playerName: ""
    };
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
    if(this.diceStateDoc) {
      this.diceStateDoc.update(this.diceState);
    }
  }
}
