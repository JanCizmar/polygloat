import {TranslationManager} from './translationManager';

export class Polygloat {
    static get lang() {
        return TranslationManager.getInstance().lang;
    }

    static set lang(lang: string) {
        TranslationManager.getInstance().lang = lang;
    }

    public static run(lang: string): Promise<void> {
        return TranslationManager.getInstance(lang).manage();
    };

    static translate = (inputText: string) => {
        return TranslationManager.getInstance().service.getTranslation(inputText);
    };
}
