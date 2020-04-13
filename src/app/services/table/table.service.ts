import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Table } from './Table';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  tableDoc: AngularFirestoreDocument<Table>
  table: Table;

  constructor(private firestore: AngularFirestore) { 

    this.table = {
      notes: ""
    }

    this.tableDoc = this.firestore.doc('tables/mwD728EWLfKKgqbaiDpH');
    this.tableDoc.valueChanges().subscribe( table => {
      this.table = table;
    });
  }

  updateNotes() {
    this.tableDoc.update(this.table);
  }
}
