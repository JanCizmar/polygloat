import {APP_INITIALIZER, NgModule} from '@angular/core';
import {TranslatePipe} from './translate.pipe';
import {TranslationsProvider} from './translations-provider';
import {PolygloatConfig} from "polygloat";
import {TranslateService} from "./translate.service";
import {STranslatePipe} from "./stranslate.pipe";

// @dynamic
@NgModule({
  declarations: [
    TranslatePipe,
    STranslatePipe
  ],
  imports: [
    //CommonModule,
    //HttpClientModule
  ],
  exports: [
    TranslatePipe,
    STranslatePipe
  ],
  providers: []
})
export class NgxPolygloatModule {

  // @dynamic
  static forRoot(options: PolygloatConfig) {
    options = {...new PolygloatConfig(), filesUrlPrefix: "/assets/i18n/", ...options};

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
        },
        {provide: PolygloatConfig, useValue: options}
      ],
    }
  }
}
