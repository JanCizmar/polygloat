import {container, singleton} from 'tsyringe';

import {languageService} from '../../service/languageService';
import {LanguageDTO} from '../../service/response.types';
import {AbstractLoadableActions, StateWithLoadables} from "../AbstractLoadableActions";
import {useSelector} from "react-redux";
import {AppState} from "../index";

export class LanguagesState extends StateWithLoadables<LanguageActions> {
    languages: LanguageDTO[] = undefined;
}

@singleton()
export class LanguageActions extends AbstractLoadableActions<LanguagesState> {
    private service = container.resolve(languageService);

    constructor() {
        super(new LanguagesState());
    }

    get loadableDefinitions() {
        return {
            list: this.createLoadableDefinition(this.service.getLanguages),
            language: this.createLoadableDefinition(this.service.get),
            create: this.createLoadableDefinition(this.service.create, null, "Language created"),
            edit: this.createLoadableDefinition(this.service.editLanguage, null, "Language saved"),
            delete: this.createLoadableDefinition(this.service.delete, null, "Language deleted"),
        };
    }

    useSelector<T>(selector: (state: LanguagesState) => T): T {
        return useSelector((state: AppState) => selector(state.languages))
    }

    get prefix():
        string {
        return 'LANGUAGES';
    }

}

