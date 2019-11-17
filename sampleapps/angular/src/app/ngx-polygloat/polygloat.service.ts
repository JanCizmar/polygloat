import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

const REPOSITORY_ID = 2;
const LANGUAGE = "en";
const SERVER_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class PolygloatService {

  private translationsCache;

  constructor(private http: HttpClient) {
  }

  async getTranslations() {
    if (this.translationsCache == null) {
      this.translationsCache = await this.http
        .get(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/${LANGUAGE}`).toPromise();
    }
    return this.translationsCache;
  }

  async getTranslation(name: String) {
    let translations = await this.getTranslations();
    let filtered = translations.filter(t => t.source === name)
    if (filtered.length > 0) {
      return filtered[0].translatedText;
    }
    return null;
  }
}
