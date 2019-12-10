import {Folder, Translation as TranslationType} from './types';
import {container} from 'tsyringe';
import {translationService} from '../../service/translationService';
import {Action, PromiseAction} from '../Action';
import {TranslationsState} from './DTOs/TrasnlationsState';

const PREFIX = 'TRANSLATION_';

export class Actions {
    static onFolderToggle = new Action(PREFIX + 'FOLDER_TOGGLE', (folder: Folder) => folder);

    static onEdit = new Action(PREFIX + 'EDIT_START', (t: TranslationType) => t);
    static onEditClose = new Action(PREFIX + 'EDIT_CLOSE', (t: TranslationType) => t);
    static loadTranslations = new PromiseAction('LOAD_TRANSLATIONS',
        (...params: any[]) => Actions.service.getTranslations(...params));
    static onSave = new PromiseAction(PREFIX + 'SAVE', (t: TranslationType) => Actions.service.setTranslations(t));
    static onDelete = new PromiseAction(PREFIX + 'DELETE', (t: TranslationType) => Actions.service.deleteSource(t));
    static onNewTranslation = new Action<Folder, TranslationsState>(PREFIX + 'NEW', (f: Folder) => f,
        (state, action) => {
            /*  let root = action.payload.root;
              let translations = {};
              for (const language of state.languages) {
                  translations[language] = '';
              }
              state.editingTranslation = new TranslationType('aaaa', translations, action.payload);
              state.editingTranslation.isNew = true;
              action.payload.children.push(state.editingTranslation);
              return {...state, translations: Object.create(root)};*/
            return state;
        });
    static onNewFolder = new Action(PREFIX + 'NEW_FOLDER', (f: Folder) => f);
    static onFolderEdit = new Action(PREFIX + 'FOLDER_EDIT', (f: Folder) => f);
    static onFolderEditClose = new Action(PREFIX + 'FOLDER_EDIT_CLOSE', (f: Folder) => f);
    private static service = container.resolve(translationService);
    static onFolderEditSave = new Action(PREFIX + 'FOLDER_EDIT_SAVE',
        (f: Folder) => Actions.service.editFolder(f));
    static onFolderDelete = new Action(PREFIX + 'FOLDER_DELETE',
        (f: Folder) => (f: Folder) => Actions.service.deleteFolder(f));
}

