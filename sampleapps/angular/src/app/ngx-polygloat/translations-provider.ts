import {Injectable} from '@angular/core';
import {Polygloat} from 'polygloat';

@Injectable()
export class TranslationsProvider {

  async load() {
    return await Polygloat.run('en');
  }
}


