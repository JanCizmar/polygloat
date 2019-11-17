import {Injectable} from '@angular/core';
import {TranslationManager} from '../translationManager';

@Injectable()
export class TranslationsProvider {

  load() {
    return TranslationManager.getInstance().manage();
  }
}
