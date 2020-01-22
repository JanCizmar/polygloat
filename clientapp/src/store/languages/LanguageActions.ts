import {container, singleton} from 'tsyringe';
import {AbstractActions} from '../AbstractActions';
import {LanguageDTO} from '../../service/response.types';
import {LanguagesState} from './LanguagesState';
import {languageService} from '../../service/languageService';

@singleton()
export class LanguageActions extends AbstractActions<LanguagesState> {
    private service = container.resolve(languageService);


    resetEdit = this.createAction<void>('RESET_EDIT', null)
        .build.on(state => (<LanguagesState> {
            ...state,
            languageSaved: false,
            languagesLoading: false
        }));

    loadLanguages = this.createPromiseAction<LanguageDTO[], any>('LOAD_LANGUAGES',
        (repositoryId: number) => this.service.getLanguages(repositoryId))
        .build.onFullFilled((state, action) => {
            return {...state, languages: action.payload, languagesLoading: false};
        }).build.onPending((state, action) => ({...state, languagesLoading: true}));

    editLanguage = this.createPromiseAction('EDIT_LANGUAGE',
        (repositoryId, languageId, values) => this.service.editLanguage(repositoryId, {...values, id: languageId}))
        .build.onPending((state, action) => ({...state, languageSaving: true}))
        .build.onFullFilled((state, action) => (
            {...state, languageSaved: true, languageSaving: false}));

    get prefix(): string {
        return 'LANGUAGES';
    }

}

