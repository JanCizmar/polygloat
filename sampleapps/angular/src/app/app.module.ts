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
    NgxPolygloatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
