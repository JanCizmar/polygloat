const REPOSITORY_ID = 2;
const LANGUAGE = "en";
const SERVER_URL = "http://localhost:8080/"

export class PolygloatService {

  private translationsCache;

  async getTranslations() {
    if (this.translationsCache == null) {
      await this.fetchTranslations();
    }
    return this.translationsCache;
  }

  async fetchTranslations() {
    let requestResult = await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/${LANGUAGE}`);
    this.translationsCache = await requestResult.json();
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
