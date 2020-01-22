import {LanguageDTO} from '../../service/response.types';

export class LanguagesState {
    languages: LanguageDTO[] = undefined;
    languagesLoading: boolean = true;
    languageSaving: boolean = false;
    languageSaved: boolean = false;
}
