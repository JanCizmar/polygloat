import {Injectable} from '@angular/core';
import {TranslationManager} from 'polygloat';

@Injectable()
export class TranslationsProvider {

  load() {
    return TranslationManager.getInstance().manage();
  }
}


