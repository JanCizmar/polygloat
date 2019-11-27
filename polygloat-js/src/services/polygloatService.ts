import {TranslationData} from '../DTOs/TranslationData';
import {Properties} from '../Properties';
import {singleton} from 'tsyringe';

const REPOSITORY_ID = 2;
const SERVER_URL = 'http://localhost:8080/';


@singleton()
export class PolygloatService {

    private translationsCache: Map<string, any[]> = new Map<string, any[]>();
    private fetchPromise: Promise<any>;

    constructor(private properties: Properties) {
    };

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
        //await new Promise(resolve => setTimeout(resolve, 5000));
        let requestResult = await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/${lang}`);
        this.translationsCache.set(lang, await requestResult.json());
    }

    async getTranslation(name: String, lang: string = this.properties.currentLanguage) {
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

    getSourceTranslations = async (sourceText: string): Promise<TranslationData> => {
        let result = new TranslationData(sourceText, new Map<string, string>());
        let data: any[] = await (await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/source/${sourceText}`))
            .json();
        data.forEach(t => result.translations.set(t.languageAbbr, t.translatedText));
        return result;
    };

    async setTranslations(translationData: TranslationData) {
        let data = Array.from(translationData.translations, ([key, value]) => ({
            languageAbbr: key,
            translatedText: value,
            source: translationData.input
        }));

        data.forEach(t => {
            if (this.translationsCache.get(t.languageAbbr)) {
                this.translationsCache.get(t.languageAbbr).filter(ct => ct.source === t.source)[0].translatedText = t.translatedText;
            }
        });

        return await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations`, {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    async replace(text: string, lang: string = this.properties.currentLanguage)
        : Promise<{ inputs: string[], newValue: string, oldValue: string }> {
        //to ensure, that translations are loaded before instant is called
        let inputs: string[] = [];
        await this.getTranslations(lang);
        let oldValue = text;
        text = text.replace(
            new RegExp(`${this.properties.config.inputPrefix}(.*?)${this.properties.config.inputPostfix}`, 'gm'),
            (_, g1) => {
                inputs.push(g1);
                return this.instant(g1, lang);
            });

        return {inputs, newValue: text, oldValue};
    }
}
