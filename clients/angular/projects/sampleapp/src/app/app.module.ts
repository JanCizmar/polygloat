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
      apiKey: "ga9amv7ut8slf6av0rfjdjcvqo",
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
