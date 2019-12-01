import {Translation as TranslationType} from './types';
import {container} from 'tsyringe';
import {translationService} from '../../service/translationService';
import {Action, PromiseAction} from '../Action';

const PREFIX = 'TRANSLATION_';

export class Actions {
    static onEdit = new Action(PREFIX + 'EDIT_START', (t: TranslationType) => t);
    static onEditClose = new Action(PREFIX + 'EDIT_CLOSE', (t: TranslationType) => t);
    private static service = container.resolve(translationService);
    static loadTranslations = new PromiseAction('LOAD_TRANSLATIONS',
        (...params: any[]) => Actions.service.getTranslations(...params));
    static onSave = new PromiseAction(PREFIX + 'SAVE', (t: TranslationType) => Actions.service.setTranslations(t));
    static onDelete = new PromiseAction(PREFIX + 'DELETE', (t: TranslationType) => Actions.service.deleteSource(t));
}

