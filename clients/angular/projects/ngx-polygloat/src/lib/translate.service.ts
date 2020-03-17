import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {Polygloat, PolygloatConfig} from "polygloat";

@Injectable()
export class TranslateService {

  constructor() {
    console.log("construct tr service");
  }

  private _polygloat: Polygloat;

  public get polygloat(): Polygloat {
    return this._polygloat;
  }

  public async start(config: PolygloatConfig): Promise<void> {
    this._polygloat = new Polygloat(config);
    await this.polygloat.run();
    console.log(new Date().toISOString(), "running");
  }

  public setLang(lang: string) {
    this.polygloat.lang = lang;
  }

  public get(input: string): Observable<string> {
    //console.log(new Date().toISOString(), this.polygloat);
    return <Observable<string>>from(this.polygloat.translate(input));
  }

}
