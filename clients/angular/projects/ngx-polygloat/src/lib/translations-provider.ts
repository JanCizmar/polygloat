import {Injectable} from '@angular/core';
import {Polygloat, PolygloatConfig} from "polygloat";
import {TranslateService} from "./translate.service";

@Injectable()
export class TranslationsProvider {

  constructor(private translateService: TranslateService) {
    console.log("provider");
  }

  async load(options: PolygloatConfig) {
    return await this.translateService.start(options);
  }
}


