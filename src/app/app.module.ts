import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDgKF_vVuRcXnDmePzXqHvJquHfx1xM_Us",
  authDomain: "opengameboard.firebaseapp.com",
  databaseURL: "https://opengameboard.firebaseio.com",
  projectId: "opengameboard",
  storageBucket: "opengameboard.appspot.com",
  messagingSenderId: "465982726983",
  appId: "1:465982726983:web:a0f8e8b43d6803f8826262",
  measurementId: "G-H7D2TY6Q70"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
