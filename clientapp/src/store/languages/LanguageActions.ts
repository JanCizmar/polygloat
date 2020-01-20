import {container, singleton} from 'tsyringe';
import {AbstractActions} from '../AbstractActions';
import {LanguageResponseType} from '../../service/response.types';
import {LanguagesState} from './LanguagesState';
import {languageService} from '../../service/languageService';

@singleton()
export class LanguageActions extends AbstractActions<LanguagesState> {
    resetEdit = this.createAction<void>('RESET_EDIT', null)
        .build.on(state => (<LanguagesState> {
            ...state,
            languageSaved: false,
            languagesLoading: false
        }));
    private service = container.resolve(languageService);
    loadLanguages = this.createPromiseAction<LanguageResponseType[], any>('LOAD_LANGUAGES',
        (repositoryId: number) => this.service.getLanguages(repositoryId))
        .build.onFullFilled((state, action) => {
            return {...state, languages: action.payload, languagesLoading: false};
        }).build.onPending((state, action) => ({...state, languagesLoading: true}));

    get prefix(): string {
        return 'REPOSITORIES';
    }

}

