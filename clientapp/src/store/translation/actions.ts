import {Folder, Translation as TranslationType} from './types';
import {container} from 'tsyringe';
import {translationService} from '../../service/translationService';
import {Action, PromiseAction} from '../Action';
import {TranslationsState} from './DTOs/TrasnlationsState';
import {LanguageResponseType, TranslationsDataResponse} from '../../service/response.types';
import {languageService} from '../../service/languageService';

const PREFIX = 'TRANSLATION_';

export class Actions {
    private static service = container.resolve(translationService);
    static loadTranslations = new PromiseAction<TranslationsDataResponse, TranslationsState>('LOAD_TRANSLATIONS',
        (search: string, langs: string[]) => Actions.service.getTranslations(search, langs));

    static onFolderToggle = new Action(PREFIX + 'FOLDER_TOGGLE', (folder: Folder) => folder);

    static onEdit = new Action(PREFIX + 'EDIT_START', (t: TranslationType) => t);
    static onEditClose = new Action(PREFIX + 'EDIT_CLOSE', (t: TranslationType) => t);
    private static languageService = container.resolve(languageService);
    static onSave = new PromiseAction(PREFIX + 'SAVE',
        (t: TranslationType) => Actions.service.setTranslations(t),
        null,
        'Translation saved'
    );
    static onDelete = new PromiseAction<any, TranslationsState>(PREFIX + 'DELETE',
        (t: TranslationType) => Actions.service.deleteFile(t), null, 'Translation deleted');
    static onNewTranslation = new Action<Folder, TranslationsState>(PREFIX + 'NEW', (f: Folder) => f,
        (state, action) => {
            return state.newTranslation(action.payload);
        });
    static onNewFolder = new Action(PREFIX + 'NEW_FOLDER', (f: Folder) => f);
    static onFolderEdit = new Action(PREFIX + 'FOLDER_EDIT', (f: Folder) => f);
    static onFolderEditClose = new Action(PREFIX + 'FOLDER_EDIT_CLOSE', (f: Folder) => f);
    static onFolderEditSave = new PromiseAction(PREFIX + 'FOLDER_EDIT_SAVE',
        (oldFolder: Folder, newFolder: Folder) => Actions.service.moveFile(oldFolder, newFolder));
    static onFolderDelete = new Action(PREFIX + 'FOLDER_DELETE',
        (f: Folder) => (f: Folder) => Actions.service.deleteFolder(f));
    static loadLanguages = new PromiseAction<LanguageResponseType[], TranslationsState>('LOAD_LANGUAGES',
        (repositoryId: number) => Actions.languageService.getLanguages(repositoryId));
}

