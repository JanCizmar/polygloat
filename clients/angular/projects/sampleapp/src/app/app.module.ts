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
      apiKey: "kld65v4h4729mh48lcdu2jdcv3",
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
