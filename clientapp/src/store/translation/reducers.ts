import {Folder, Translation as TranslationType, Translation} from './types';
import {DataTransformation} from '../../helpers/dataTransformation';
import {Actions} from './actions';
import {Action} from '../Action';
import {TranslationsState} from './TrasnlationsState';
import {LanguageResponseType, TranslationsDataResponse} from '../../service/response.types';

const initialState: TranslationsState = new TranslationsState();

export function translationReducer(
    state = initialState,
    action: { type: string, payload: any }
): TranslationsState {
    switch (action.type) {
        case Actions.loadTranslations.pendingType:
            return state.modify({translationsLoading: true});
        case Actions.loadTranslations.fulfilledType:
            const payload = action.payload as TranslationsDataResponse;
            const res = state.modify({
                translations: DataTransformation.toFolderStructure(payload.data),
                translationsLoaded: true,
                translationsLoading: false,
                translationLoadingError: null,
                selectedLanguages: payload.params.languages
            });
            return res;
        case Actions.loadTranslations.rejectedType:
            return state.modify({translationLoadingError: action.payload});
        case Actions.onEdit.type:
            return state.modify({...resetAllEdits(state), editingTranslation: action.payload});
        case Actions.onEditClose.type:
            if (state.editingTranslation.isNew) {
                state.removeTranslation(action.payload);
            }
            return state.modify({editingTranslation: null});
        case Actions.onSave.fulfilledType:
            const translation = action.payload as Translation;
            translation.isNew = false;
            return state.modify({...state.modifyTranslation(translation as Translation), ...resetAllEdits(state)});
        case Actions.onSave.pendingType:
            return state.modify({editLoading: true});
        case Actions.onDelete.pendingType:
            return state.modify({editLoading: true});
        case Actions.onDelete.fulfilledType:
            return state.removeTranslation(action.payload as TranslationType);
        case Actions.onFolderToggle.type:
            const {root, folder} = state.clonePath((action.payload as Folder).fullPath);
            folder.expanded = !folder.expanded;
            return state.modify({translations: root});
        case Actions.onFolderEdit.type:
            return state.modify({...resetAllEdits(state), editingFolder: action.payload});
        case Actions.onFolderEditSave.fulfilledType:
            return state.modify({...resetAllEdits, ...state.modifyFolder(action.payload as Folder)});
        case Actions.onFolderEditClose.type:
            return state.modify({...resetAllEdits(state)});
        case Actions.loadLanguages.pendingType:
            return state.modify({...state, settingsPanelLoading: true});
        case Actions.loadLanguages.fulfilledType:
            const allLanguagesPayload: LanguageResponseType[] = action.payload;
            return state.modify({...state, allLanguages: allLanguagesPayload.map(l => l.abbreviation), settingsPanelLoading: false});
        default:
            for (const key of Object.keys(Actions)) {
                if (Actions[key] instanceof Action) {
                    let actionDef = (Actions[key] as Action);
                    if (action.type === actionDef.type && typeof actionDef.stateModifier === 'function') {
                        return (Actions[key] as Action).stateModifier(state, action);
                    }
                }
            }
            return state;
    }
}

/**
 * Remove edit state of all editable properties to allow user to edit just one think at the time
 * @param state
 */
const resetAllEdits = (state: TranslationsState): TranslationsState => {
    state.editLoading = false;
    state.editingTranslation = null;
    state.editingSaved = false;
    state.editingError = null;
    state.editingFolder = null;
    state.addingFolderIn = null;
    state.addingTranslationIn = null;
    return state;
};
