import {Injectable} from '@angular/core';
import {Polygloat} from 'polygloat';

@Injectable()
export class TranslationsProvider {

  load() {
    return Polygloat.run('en');
  }
}


