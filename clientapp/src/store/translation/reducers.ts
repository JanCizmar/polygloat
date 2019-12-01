import {Folder, Translation} from './types';
import {DataTransformation} from '../../helpers/dataTransformation';
import {Actions} from './actions';

export class TranslationTableState {
    translations: Folder = null;
    translationsLoading: boolean = false;
    translationsLoaded: boolean = false;
    translationLoadingError: string = null;
    languages: string[] = [];
    editingTranslation: Translation = null;
    editLoading: boolean = false;
    editingSaved: boolean = false;
    editingError: string = null;
}

const initialState: TranslationTableState = new TranslationTableState();

export function translationReducer(
    state = initialState,
    action: { type: string, payload: any }
): TranslationTableState {
    switch (action.type) {
        case Actions.loadTranslations.pendingType:
            return {...state, translationsLoading: true};
        case Actions.loadTranslations.fulfilledType:
            return {
                ...state,
                languages: Object.keys(action.payload),
                translations: DataTransformation.translationsToArray(action.payload),
                translationsLoaded: true,
                translationsLoading: false,
                translationLoadingError: null,
            };
        case Actions.loadTranslations.rejectedType:
            return {...state, translationLoadingError: action.payload};
        case Actions.onEdit.type:
            return {...state, editingTranslation: action.payload};
        case Actions.onEditClose.type:
            return {...state, editingTranslation: null};
        case Actions.onSave.fulfilledType:
            return {...state, editingSaved: true, editLoading: false, editingTranslation: null};
        case Actions.onSave.pendingType:
            return {...state, editLoading: true};
        case Actions.onDelete.pendingType:
            return {...state, editLoading: true};
        case Actions.onDelete.fulfilledType:
            return {...state, translations: action.payload, editLoading: false};
        default:
            return state;
    }
}
