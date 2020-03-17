import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from './translate.pipe';
import {HttpClientModule} from '@angular/common/http';
import {TranslationsProvider} from './translations-provider';
import {PolygloatConfig} from "polygloat/src/PolygloatConfig";

const getTranslationsProviderFactory = (options: PolygloatConfig) => (provider: TranslationsProvider) => {
  return () => provider.load(options);
};

@NgModule({
  declarations: [
    TranslatePipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    TranslatePipe,
  ],
})
export class NgxPolygloatModule {
  public static forRoot(options: PolygloatConfig) {
    return {
      ngModule: NgxPolygloatModule,
      providers: [
        TranslationsProvider, {
          provide: APP_INITIALIZER,
          useFactory: getTranslationsProviderFactory(options),
          deps: [TranslationsProvider],
          multi: true
        }
      ]
    }
  }
}
