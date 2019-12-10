import {Folder, Translation} from '../types';

export class TranslationsState {
    translations: Folder = null;
    translationsLoading: boolean = false;
    translationsLoaded: boolean = false;
    translationLoadingError: string = null;
    languages: string[] = [];
    editingTranslation: Translation = null;
    editLoading: boolean = false;
    editingSaved: boolean = false;
    editingError: string = null;
    editingFolder: Folder = null;
    addingFolderIn: Folder = null;
    addingTranslationIn: Folder = null;

    modifyTranslation(t: Translation): TranslationsState {
        let root = this.translations.clone;
        let folder = root;
        for (const folderName of t.path) {
            let child: Folder = folder.getChildByName(folderName) as Folder;

            if (child === undefined) {
                throw new Error('Subfolder with name ' + folderName + ' does not exist in folder ' + folder.name + '.');
            }

            const clone = child.clone;
            folder.children[folder.children.indexOf(child)] = clone;
            folder = clone;
        }

        let translation: Translation = folder.children
            .find(tr => tr instanceof Translation && (tr as Translation).oldName === t.oldName) as Translation;

        if (translation === undefined) {
            throw new Error('Can not find translation');
        }

        folder.children[folder.children.indexOf(translation)] = t;
        t.oldName = t.name;
        return {...this, translations: root};
    }

    modify(props: { [P in keyof TranslationsState]: TranslationsState[P] } | any): TranslationsState {
        return Object.assign(new TranslationsState(), this, props);
    }
}
