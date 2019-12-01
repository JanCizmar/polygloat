import {TranslationData} from '../DTOs/TranslationData';
import {Properties} from '../Properties';
import {singleton} from 'tsyringe';

const REPOSITORY_ID = 2;
const SERVER_URL = 'http://localhost:8080/';

type Translations = { [key: string]: string | Translations };

@singleton()
export class PolygloatService {

    private translationsCache: Map<string, Translations> = new Map<string, Translations>();
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

    async getTranslation(name: string, lang: string = this.properties.currentLanguage): Promise<string> {
        await this.getTranslations(lang);
        return this.instant(name, lang);
    }

    instant(name: string, lang: string): string {
        const path = name.split('.');
        let root: string | Translations = this.translationsCache.get(lang);
        for (const item of path) {
            if (root[item] === undefined) {
                return name;
            }
            root = root[item];
        }
        return root as string;
    }

    getSourceTranslations = async (sourceText: string): Promise<TranslationData> => {
        let data = await (await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/source/${sourceText}`))
            .json();
        return new TranslationData(sourceText, data);
    };

    async setTranslations(translationData: TranslationData) {
        await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations`, {
            body: JSON.stringify(translationData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });


        Object.keys(translationData.translations).forEach(lang => {
            if (this.translationsCache.get(lang)) {
                const path = translationData.source.split('.');
                let root: string | Translations = this.translationsCache.get(lang);
                for (let i = 0; i < path.length; i++) {
                    let item = path[i];
                    if (root[item] === undefined) {
                        root[item] = {};
                    }
                    if (i === (path.length - 1)) {
                        root[item] = translationData.translations[lang];
                        return;
                    }
                    root = root[item];
                }
            }
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
