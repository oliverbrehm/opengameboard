import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Table } from './Table';
import { Router } from '@angular/router';
import { DiceService } from '../dice/dice.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  tablesCollection: AngularFirestoreCollection<Table>;
  tableSnapshots: QueryDocumentSnapshot<Table>[];
  tables: Table[];

  currentTable: Table;
  currentTableSnapshot: QueryDocumentSnapshot<Table>;

  constructor(private firestore: AngularFirestore, private router: Router) { 

    this.currentTable = {
      name: "",
      notes: ""
    }

    this.tablesCollection = this.firestore.collection('tables');

    this.tablesCollection.snapshotChanges().subscribe( actions => {
      this.tables = [];
      this.tableSnapshots = [];

      actions.forEach( action => {
        this.tables.push(action.payload.doc.data());
        this.tableSnapshots.push(action.payload.doc);


        console.log("id: " + action.payload.doc.id);
        console.log("type: " + action.type + ", payl type: " + action.payload.type);
        console.log("data: " + action.payload.doc.data().name);
        console.log("---");
      })
    })
  }

  newTable() {
    let name = prompt("Gib einen namen für den Tisch ein:");

    if(!name) { return; }

    this.tablesCollection.add({
      name: name,
      notes: ""
    }).then( document => {
      this.firestore.doc("tables/" + document.id + "/state/dice").set({
        diceCount: 1,
        inCup: [1],
        onTable: [],
        playerName: ""
      })
    });
  }

  enterTable(tableSnapshot: QueryDocumentSnapshot<Table>) {
    this.tableSnapshots.forEach( table => {
      if(table.id == tableSnapshot.id) {
        this.currentTableSnapshot = table;
        this.currentTable = table.data();
        this.router.navigate(["/table"]);
      }
    });

  }

  deleteTable(tableSnapshot: QueryDocumentSnapshot<Table>) {
    this.tablesCollection.doc(tableSnapshot.id).delete();
  }

  updateNotes() {
    this.currentTableSnapshot.ref.update(this.currentTable);
  }
}
