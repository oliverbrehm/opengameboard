import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Table } from './Table';
import { Router } from '@angular/router';
import { Player } from '../player/Player';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  tablesCollection: AngularFirestoreCollection<Table>;
  tables: Table[];

  currentTable: Table;

  constructor(private firestore: AngularFirestore, private router: Router) { 

    this.currentTable = {
      id: "",
      name: "",
      notes: "", 
      playerIds: []
    }

    this.tablesCollection = this.firestore.collection('tables');

    this.tablesCollection.snapshotChanges().subscribe( actions => {
      this.tables = [];

      actions.forEach( action => {
        this.tables.push(action.payload.doc.data());
      })
    })
  }

  newTable() {
    let name = prompt("Gib einen namen für den Tisch ein:");

    if(!name) { return; }

    let table = {
      id: "",
      name: name,
      notes: "",
      playerIds: []
    }

    this.tablesCollection.add(table).then( document => {
      table.id = document.id;
      document.update(table);

      this.firestore.doc("tables/" + document.id + "/state/dice").set({
        diceCount: 1,
        inCup: [1],
        onTable: [],
        playerName: ""
      })
    });
  }

  enterTable(table: Table) {
    this.currentTable = table;

    this.tablesCollection.doc(table.id).valueChanges().subscribe(table => {
      this.currentTable = <Table>table;
    });

    this.update();

    this.router.navigate(["/table"]);
  }

  removePlayer(player: Player) {
    let index = this.currentTable.playerIds.indexOf(player.id);
    console.log(index);
    this.currentTable.playerIds.splice(index, 1);
    this.update();
  }

  deleteTable(tableSnapshot: QueryDocumentSnapshot<Table>) {
    this.tablesCollection.doc(tableSnapshot.id).delete();
  }

  update() {
    console.log('updating ' + this.currentTable.id);
    if(this.currentTable) {
      this.tablesCollection.doc(this.currentTable.id).update(this.currentTable);
    }
  }
}
