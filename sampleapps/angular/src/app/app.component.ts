import {Component, OnInit} from '@angular/core';
import {Polygloat} from 'polygloat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  text1: string;

  async setTexts() {
    this.text1 = await Polygloat.translate('sampleApp.this_is_translation_retrieved_by_service');
  //  console.log(this.text1);
  }

  async ngOnInit(): Promise<void> {
    await this.setTexts();
  }


  setLang(lang: string) {
    Polygloat.lang = lang;
  }
}
