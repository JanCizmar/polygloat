import {Translation} from './types';
import {DataTransformation} from '../../helpers/dataTransformation';
import {Actions} from './actions';
import {Action} from '../Action';
import {TranslationsState} from './DTOs/TrasnlationsState';

const initialState: TranslationsState = new TranslationsState();

export function translationReducer(
    state = initialState,
    action: { type: string, payload: any }
): TranslationsState {
    switch (action.type) {
        case Actions.loadTranslations.pendingType:
            return state.modify({translationsLoading: true});
        case Actions.loadTranslations.fulfilledType:
            return state.modify({
                languages: Object.keys(action.payload),
                translations: DataTransformation.translationsToArray(action.payload),
                translationsLoaded: true,
                translationsLoading: false,
                translationLoadingError: null,
            });
        case Actions.loadTranslations.rejectedType:
            return state.modify({translationLoadingError: action.payload});
        case Actions.onEdit.type:
            return state.modify({...resetAllEdits(state), editingTranslation: action.payload});
        case Actions.onEditClose.type:
            if (state.editingTranslation.isNew) {
                //state.editingTranslation.removeFromParent();
            }
            return state.modify({...state, editingTranslation: null});
        case Actions.onSave.fulfilledType:
            //action.payload.isNew = false;
            //let deepCopy = action.payload.deepCopy;
            return state.modify({...state.modifyTranslation(action.payload as Translation), ...resetAllEdits(state)});
        case Actions.onSave.pendingType:
            return state.modify({editLoading: true});
        case Actions.onDelete.pendingType:
            return state.modify({editLoading: true});
        case Actions.onDelete.fulfilledType:
        //     return {...state, translations: action.payload, editLoading: false};
        case Actions.onFolderToggle.type: {
            //let folder = action.payload as Folder;
            //folder.expanded = !folder.expanded;
            //return {...state, translations: folder.root};
        }
        case Actions.onFolderEdit.type: {
            //  return {...resetAllEdits(state), editingFolder: action.payload};
        }
        case Actions.onFolderEditClose.type:
        //return {...resetAllEdits(state)};
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