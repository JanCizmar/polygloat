import {Injectable} from '@angular/core';
import {PolygloatConfig} from "polygloat";
import {TranslateService} from "./translate.service";

@Injectable()
export class TranslationsProvider {

  constructor(private translateService: TranslateService) {
  }

  async load(options: PolygloatConfig) {
    return await this.translateService.start(options);
  }
}


