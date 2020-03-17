import {Injectable} from '@angular/core';
import {Polygloat} from 'polygloat';
import {PolygloatConfig} from "polygloat/src/PolygloatConfig";

@Injectable()
export class TranslationsProvider {

  async load(options: PolygloatConfig) {
    return Polygloat.run(options);
  }
}


