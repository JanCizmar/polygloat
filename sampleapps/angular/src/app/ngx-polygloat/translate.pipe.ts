import {Pipe, PipeTransform} from '@angular/core';
import {Polygloat} from 'polygloat';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {

  value = '';
  lastKey: string;

  transform(value: any, ...args: any[]): any {
    if (!value || value.length === 0) {
      return value;
    }

    if (value === this.lastKey) {
      return this.value;
    }

    this.lastKey = value;

    Polygloat.translate(value).then(r => {
      this.value = r;
    });

    return this.value;
  }
}
