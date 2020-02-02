import {container, singleton} from 'tsyringe';
import {AbstractLoadableActions, StateWithLoadables} from "../AbstractLoadableActions";
import {translationService} from "../../service/translationService";
import {AppState} from "../index";
import {useSelector} from "react-redux";
import {TranslationsDataResponse} from "../../service/response.types";

export class TranslationsState extends StateWithLoadables<TranslationActions> {
    selectedLanguages: string[] = [];
}


const service = container.resolve(translationService);

@singleton()
export class TranslationActions extends AbstractLoadableActions<TranslationsState> {
    constructor() {
        super(new TranslationsState());
    }

    select = this.createAction("SELECT_LANGUAGES",
        (langs) => langs).build.on((state, action) =>
        (<TranslationsState>{...state, selectedLanguages: action.payload}));


    get loadableDefinitions() {
        return {
            translations: this.createLoadableDefinition(service.getTranslations, (state, action) => {
                return {...state, selectedLanguages: action.payload.params.languages}
            }),
            createSource: this.createLoadableDefinition(service.createSource),
            editSource: this.createLoadableDefinition(service.editSource),
            setTranslations: this.createLoadableDefinition(service.setTranslations)
        };
    }


    useSelector<T>(selector: (state: TranslationsState) => T): T {
        return useSelector((state: AppState) => selector(state.translations))
    }

    get prefix(): string {
        return 'TRANSLATIONS';
    }

}