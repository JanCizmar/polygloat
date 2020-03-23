import {Component, OnInit} from '@angular/core';
import {TranslateService} from "ngx-polygloat";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private translateService: TranslateService) {

  }

  text1: string;

  async setTexts() {
    this.text1 = await this.translateService.get('sampleApp.this_is_translation_retrieved_by_service').toPromise();
  }

  async ngOnInit(): Promise<void> {
    await this.setTexts();
  }

  setLang(lang: string) {
    this.translateService.setLang(lang);
  }

  params = {name: "Honza", surname: "Cizmar", title: "title"};

}
