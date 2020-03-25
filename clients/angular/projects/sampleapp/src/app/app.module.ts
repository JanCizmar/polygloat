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
      //apiKey: "bf5iddr7dc47m74q7cg3tfkud4",
      //mode: "production"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
