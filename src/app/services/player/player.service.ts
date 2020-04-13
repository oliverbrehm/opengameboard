import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Player } from "./Player";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersCollection: AngularFirestoreCollection<Player>;
  players: Array<Player>;
  playerDoc: AngularFirestoreDocument<Player>;
  player: Player;

  constructor(private firestore: AngularFirestore) { 
    this.playersCollection = this.firestore.collection('tables/mwD728EWLfKKgqbaiDpH/players');
    this.playersCollection.valueChanges().subscribe( players => {
      this.players = players;
    });

    this.player = {
      name: "Anonym"
    };

    this.playersCollection.add(this.player).then( docRef => {
      this.playerDoc = this.firestore.doc(docRef);
    });

    //this.changePlayerName();
  }

  changePlayerName() {
    let name = prompt("Hallo, wie heißt du?");
    if(name && name.length > 0) {
      this.player.name = name;
    } else {
      this.player.name = "Anonym"
    }

    if(this.playerDoc) {
      this.playerDoc.update(this.player);
    }
  }

  logout() {
    this.playerDoc.delete();
  }

  removePlayer(player: Player) {
    // TODO remove player from db
  }
}
