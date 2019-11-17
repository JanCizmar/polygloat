import {Pipe, PipeTransform} from '@angular/core';
import {PolygloatService} from './polygloat.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {

  private cachedTranslation;
  private cachedInput;

  constructor(private service: PolygloatService) {
  }

  transform(value: any, ...args: any[]): any {
    if (this.cachedInput !== value) {
      this.service.getTranslation(value).then(r => this.cachedTranslation = r);
      this.cachedInput = value;
    }
    return `%-%polygloat:${value}%-%`;
  }
}
