import {LanguageResponseType} from '../../service/response.types';

export class LanguagesState {
    languages: LanguageResponseType[] = null;
    languagesLoading: boolean = true;
    languageSaving: boolean = false;
    languageSaved: boolean = false;
}
