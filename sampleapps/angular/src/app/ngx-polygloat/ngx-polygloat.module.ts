import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from './translate.pipe';
import {HttpClientModule} from '@angular/common/http';
import {TranslationsProvider} from './translations-provider';

export function translationsProviderFactory(provider: TranslationsProvider) {
  return () => provider.load();
}

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
  providers: [
    TranslationsProvider, {
      provide: APP_INITIALIZER,
      useFactory: translationsProviderFactory,
      deps: [TranslationsProvider],
      multi: true
    }
  ]
})
export class NgxPolygloatModule {
}
