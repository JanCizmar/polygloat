import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "./translate.service";

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {

  value = '';
  lastKey: string;

  constructor(private translateService: TranslateService) {
  }

  transform(value: any, ...args: any[]): any {
    if (!value || value.length === 0) {
      return value;
    }

    if (value === this.lastKey) {
      return this.value;
    }

    this.lastKey = value;

    this.translateService.get(value).toPromise().then(r => {
      this.value = r;
    });

    return this.value;
  }
}
