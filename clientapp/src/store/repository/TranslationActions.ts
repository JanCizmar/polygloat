import {container, singleton} from 'tsyringe';
import {AbstractLoadableActions, StateWithLoadables} from "../AbstractLoadableActions";
import {translationService} from "../../service/translationService";
import {AppState} from "../index";
import {useSelector} from "react-redux";
import {LanguageDTO} from "../../service/response.types";
import {ActionType} from "../Action";
import {LanguageActions} from "../languages/LanguageActions";
import {selectedLanguagesService} from "../../service/selectedLanguagesService";

export class TranslationsState extends StateWithLoadables<TranslationActions> {
    selectedLanguages: string[] = [];
}


const service = container.resolve(translationService);
const languageActions = container.resolve(LanguageActions);

@singleton()
export class TranslationActions extends AbstractLoadableActions<TranslationsState> {
    constructor(private selectedLanguagesService: selectedLanguagesService) {
        super(new TranslationsState());
    }

    select = this.createAction("SELECT_LANGUAGES",
        (langs) => langs).build.on((state, action) =>
        (<TranslationsState>{...state, selectedLanguages: action.payload}));


    readonly loadableDefinitions = {
        translations: this.createLoadableDefinition(service.getTranslations, (state, action) => {
            return {...state, selectedLanguages: action.payload.params.languages}
        }),
        createSource: this.createLoadableDefinition(service.createSource),
        editSource: this.createLoadableDefinition(service.editSource),
        setTranslations: this.createLoadableDefinition(service.setTranslations),
        delete: this.createLoadableDefinition(service.deleteSource)
    };

    useSelector<T>(selector: (state: TranslationsState) => T): T {
        return useSelector((state: AppState) => selector(state.translations))
    }

    customReducer(state: TranslationsState, action: ActionType<any>, appState): TranslationsState {
        appState = appState as AppState; // otherwise circular reference
        switch (action.type) {
            case languageActions.loadableActions.list.fulfilledType:
                //reseting translations state on language change
                return {
                    ...state,
                    selectedLanguages: Array.from(
                        this.selectedLanguagesService.getUpdated(appState.repositories.loadables.repository.data.id,
                            new Set(action.payload.map((l: LanguageDTO) => l.abbreviation)))
                    ),
                    loadables: {
                        ...state.loadables,
                        translations:
                        this.initialState.loadables.translations
                    }
                };
        }
        return state;
    }

    get prefix(): string {
        return 'TRANSLATIONS';
    }

}