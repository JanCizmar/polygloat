import {APP_INITIALIZER, NgModule, Optional, SkipSelf} from '@angular/core';
import {TranslatePipe} from './translate.pipe';
import {TranslationsProvider} from './translations-provider';
import {PolygloatConfig} from "polygloat";
import {TranslateService} from "./translate.service";

// @dynamic
@NgModule({
  declarations: [
    TranslatePipe,
  ],
  imports: [
    //CommonModule,
    //HttpClientModule
  ],
  exports: [
    TranslatePipe,
  ],
  providers: [
    //TranslateService
  ]
})
export class NgxPolygloatModule {

  // @dynamic
  static forRoot(options: PolygloatConfig) {
    return {
      ngModule: NgxPolygloatModule,
      providers: [
        TranslateService, TranslationsProvider,
        {
          provide: APP_INITIALIZER,
          useFactory: (provider: TranslationsProvider) => {
            return async () => await provider.load(options);
          },
          deps: [TranslationsProvider, TranslateService],
          multi: true
        }
      ],
    }
  }
}
