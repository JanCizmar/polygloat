import {Component, OnInit} from '@angular/core';
import {Polygloat} from 'polygloat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  text1: string;
  text2: string;
  text3: string;

  async setTexts() {
    Polygloat.translate('V.I._Lenin._Vladimir!_Ilyich!_Ulyanov!').then(r => this.text1 = r);
    Polygloat.translate('Mind_if_I_do_a_J?').then(r => this.text1 = r);
    Polygloat.translate('Calmer_than_you_are.').then(r => this.text1 = r);
  }

  async ngOnInit(): Promise<void> {
    await this.setTexts();
  }


  setLang(lang: string) {
    Polygloat.lang = lang;
  }
}
