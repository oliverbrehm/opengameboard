import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Player } from "./Player";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playerCollection: AngularFirestoreCollection<Player>;
  players: Player[];

  currentPlayerDoc: AngularFirestoreDocument<Player>;
  currentPlayer: Player;

  constructor(private firestore: AngularFirestore) { 
    this.playerCollection = this.firestore.collection('players');
  
    this.playerCollection.snapshotChanges().subscribe(snapshots => {
      this.players = [];

      snapshots.forEach( snapshot => {
        this.players.push(snapshot.payload.doc.data());
      });

    });

    this.playerCollection.valueChanges().subscribe( players => {
      this.players = players;
    });

    this.currentPlayer = {
      name: "Anonym",
      id: ""
    };

    this.playerCollection.add(this.currentPlayer).then( docRef => {
      this.currentPlayerDoc = this.firestore.doc(docRef);
      this.currentPlayer.id = docRef.id
      this.currentPlayerDoc.update(this.currentPlayer);
    });

    //this.changePlayerName();
  }

  playersForIds(ids: string[]) {
    let players = [];

    ids.forEach(id => {
      let player = this.playerForId(id);
      if(player) {
        players.push(player);
      }
    });
    
    return players;
  }

  playerForId(id: string): Player {
    return this.players.filter(player => player.id === id)[0];
  }

  changePlayerName() {
    let name = prompt("Hallo, wie heißt du?");
    if(name && name.length > 0) {
      this.currentPlayer.name = name;
    } else {
      this.currentPlayer.name = "Anonym"
    }

    if(this.currentPlayerDoc) {
      this.currentPlayerDoc.update(this.currentPlayer);
    }
  }

  logout() {
    this.currentPlayerDoc.delete();
  }

  removePlayer(player: Player) {
    this.playerCollection.doc(player.id).delete();
  }
}
