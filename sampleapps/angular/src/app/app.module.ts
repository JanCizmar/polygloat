import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxPolygloatModule} from './ngx-polygloat/ngx-polygloat.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxPolygloatModule.forRoot({
      apiUrl: "http://localhost:8080",
      apiKey: "g35eunaq1g4iq7asumihiidh33",
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
