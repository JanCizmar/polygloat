import {Component} from '@angular/core';
import {Polygloat} from 'polygloat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  setLang(lang: string) {
    Polygloat.lang = lang;
  }
}
