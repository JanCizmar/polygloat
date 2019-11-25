import {TranslationData} from './DTOs/TranslationData';

const REPOSITORY_ID = 2;
const LANGUAGE = 'en';
const SERVER_URL = 'http://localhost:8080/';

export class PolygloatService {

    private translationsCache: Map<string, any[]> = new Map<string, any[]>();
    private fetchPromise: Promise<any>;


    async getTranslations(lang: string) {
        if (this.translationsCache.get(lang) == undefined) {
            if (!(this.fetchPromise instanceof Promise)) {
                this.fetchPromise = this.fetchTranslations(lang);
            }
            await this.fetchPromise;
        }
        this.fetchPromise = undefined;
        return this.translationsCache.get(lang);
    }

    async fetchTranslations(lang: string) {
        let requestResult = await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/${lang}`);
        this.translationsCache.set(lang, await requestResult.json());
    }

    async getTranslation(name: String, lang: string) {
        let translations = await this.getTranslations(lang);
        let filtered = translations.filter(t => t.source === name);
        if (filtered.length > 0) {
            return filtered[0].translatedText;
        }
        return null;
    }

    instant(name: String, lang: string) {
        let translations = this.translationsCache.get(lang);
        let filtered = translations.filter(t => t.source === name);
        if (filtered.length > 0) {
            return filtered[0].translatedText;
        }
        return null;
    }

    public getSourceTranslations = async (sourceText: string): Promise<TranslationData> => {
        let result = new TranslationData(sourceText, new Map<string, string>());
        let data: any[] = await (await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/source/${sourceText}`)).json();
        data.forEach(t => result.translations.set(t.languageAbbr, t.translatedText));
        return result;
    };

    async setTranslations(translationData: TranslationData) {
        let data = Array.from(translationData.translations, ([key, value]) => ({
            languageAbbr: key,
            translatedText: value,
            source: translationData.input
        }));
        return await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations`, {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }


}
