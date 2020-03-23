import {TranslationData} from '../DTOs/TranslationData';
import {Properties, Scope} from '../Properties';
import {singleton} from 'tsyringe';
import {PolygloatData, TranslationParams, Translations} from "../Types";

@singleton()
export class PolygloatService {

    private translationsCache: Map<string, Translations> = new Map<string, Translations>();
    private fetchPromises: Promise<any>[] = [];

    constructor(private properties: Properties) {
    };

    async getTranslations(lang: string) {
        this.checkScopes("translations.view");
        if (this.translationsCache.get(lang) == undefined) {
            if (!(this.fetchPromises[lang] instanceof Promise)) {
                this.fetchPromises[lang] = this.fetchTranslations(lang);
            }
            await this.fetchPromises[lang];
        }
        this.fetchPromises[lang] = undefined;
        return this.translationsCache.get(lang);
    }

    async fetchTranslations(lang: string) {
        //await new Promise(resolve => setTimeout(resolve, 5000));
        let requestResult = await fetch(this.getUrl(`${lang}`));
        this.translationsCache.set(lang, (await requestResult.json())[lang]);
    }

    async getTranslation(name: string, lang: string = this.properties.currentLanguage): Promise<string> {
        await this.getTranslations(lang);
        if (lang !== this.properties.defaultLanguage && !this.getFromCache(name, lang)) {
            await this.getTranslations(this.properties.defaultLanguage);
            return this.instant(name, this.properties.defaultLanguage);
        }
        return this.instant(name, lang);
    }

    readonly getScopes = async () => (await fetch(this.getUrl(`scopes`))).json();

    instant(name: string, lang: string = this.properties.currentLanguage): string {
        return this.getFromCache(name, lang) || this.getFromCache(name, this.properties.defaultLanguage) || name;
    }

    getFromCache(name: string, lang: string = this.properties.currentLanguage): string {
        const path = name.split('.');
        let root: string | Translations = this.translationsCache.get(lang);
        for (const item of path) {
            if (root[item] === undefined) {
                return undefined;
            }
            root = root[item];
        }
        return root as string;
    }

    getSourceTranslations = async (sourceText: string): Promise<TranslationData> => {
        this.checkScopes("translations.view");
        let data = await (await fetch(this.getUrl(`source/${sourceText}`)))
            .json();
        return new TranslationData(sourceText, data);
    };

    async setTranslations(translationData: TranslationData) {
        this.checkScopes("translations.edit");

        let response = await fetch(this.getUrl(``), {
            body: JSON.stringify(translationData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.status != 200) {
            throw new Error("Server responded with error status code");
        }

        Object.keys(translationData.translations).forEach(lang => {
            if (this.translationsCache.get(lang)) {
                const path = translationData.sourceFullPath.split('.');
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

    async translate(input: string, params: TranslationParams, lang = this.properties.currentLanguage) {
        return this.replaceParams(await this.getTranslation(input, lang), params)
    }

    async replace(text: string, lang: string = this.properties.currentLanguage)
        : Promise<{ inputs: string[], newValue: string, oldValue: string }> {
        //to ensure, that translations are loaded before instant is called
        let inputs: string[] = [];
        await this.getTranslations(lang);
        let oldValue = text;

        text = text.replace(this.unWrapRegex, (_, g1) => {
                let data = this.parseUnwrapped(g1);
                inputs.push(data.input);
                return this.replaceParams(this.instant(data.input, lang), data.params);
            }
        );
        return {inputs, newValue: text, oldValue};
    }

    readonly parseUnwrapped = (unWrappedString: string): PolygloatData => {
        const strings = unWrappedString.split(/(?<!\\):|(?<!\\),/);
        const result = {input: strings.shift(), params: {}};

        while (strings.length) {
            const [name, value] = strings.splice(0, 2);
            result.params[name] = value;
        }
        return result;
    };

    readonly replaceParams = (translation: string, params: TranslationParams): string => {
        let result = translation;
        const regExp = (name) => new RegExp("(?<!\\\\){(?<!\\\\){\\\s*" + this.escapeRegExp(name) + "\\\s*(?<!\\\\)}(?<!\\\\)}");
        Object.entries(params).forEach(([name, value]) =>
            //replace all unescaped param template fields (the regex is this complicated because of lookbehinds)
            result = result.replace(regExp(name), value));
        return result;
    };

    readonly escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    };

    get unWrapRegex() {
        return new RegExp(`${this.properties.config.inputPrefix}(.*?)${this.properties.config.inputPostfix}`, 'gm');
    }

    isKeyAllowed(...scopes: Scope[]) {
        return !scopes.filter(s => this.properties.scopes.indexOf(s) < 0).length;
    }

    checkScopes(...scopes: Scope[]) {
        if (!this.isKeyAllowed(...scopes)) {
            throw new Error("Api key not permitted to do this, please add 'translations.view' scope.");
        }
    }

    readonly getUrl = (path: string) => `${this.properties.config.apiUrl}/uaa/${path}?ak=${this.properties.config.apiKey}`;
}

