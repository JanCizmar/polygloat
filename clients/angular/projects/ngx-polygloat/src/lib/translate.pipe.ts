import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "./translate.service";

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  value = '';
  lastHash: string;

  constructor(private translateService: TranslateService) {
  }

  private getHash(input: string, params: object, language: string): string {
    return JSON.stringify({input, params, language});
  }

  private onLangChange(input, params) {
    this.translateService.get(input, params).subscribe(r => {
      this.value = r;
    });
  }

  transform(input: any, params = {}): any {
    if (!input || input.length === 0) {
      return input;
    }

    const newHash = this.getHash(input, params, this.translateService.getCurrentLang());

    if (newHash === this.lastHash) {
      return this.value;
    }

    this.translateService.onLangChange.subscribe(() => {
      this.onLangChange(input, params);
    });

    this.onLangChange(input, params);

    this.lastHash = newHash;

    return this.value;
  }
}
