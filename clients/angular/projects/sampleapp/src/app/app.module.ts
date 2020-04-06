import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxPolygloatModule} from "ngx-polygloat";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxPolygloatModule.forRoot({
      apiUrl: "http://localhost:8080",
      apiKey: "og5bfj9m9ig9cvhp7lob8cj6bs",
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
