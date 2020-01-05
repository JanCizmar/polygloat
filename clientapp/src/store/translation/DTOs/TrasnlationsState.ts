import {Folder, Translation} from '../types';
import {AbstractState} from '../../abstractState';

export class TranslationsState extends AbstractState {
    translations: Folder = null;
    translationsLoading: boolean = true;
    translationsLoaded: boolean = false;
    translationLoadingError: string = null;
    allLanguages: string[] = null;
    editingTranslation: Translation = null;
    editLoading: boolean = false;
    editingSaved: boolean = false;
    editingError: string = null;
    editingFolder: Folder = null;
    addingFolderIn: Folder = null;
    addingTranslationIn: Folder = null;
    settingsPanelLoading: boolean = true;
    selectedLanguages: string[] = [];

    modifyTranslation(t: Translation): TranslationsState {
        const {root, folder} = this.clonePath(t.path);

        let translation = folder.findTranslationByOldName(t.oldName);

        folder.children[folder.children.indexOf(translation)] = t;
        t.oldName = t.name;
        return this.modify({translations: root});
    }

    newTranslation(f: Folder) {
        const {root, folder} = this.clonePath(f.fullPath);
        const translations = {};
        this.allLanguages.forEach(l => translations[l] = '');
        const translation = new Translation('', translations, f.fullPath);
        translation.isNew = true;
        this.editingTranslation = translation;
        folder.children.push(translation);

        return this.modify({translations: root});
    }

    public clonePath(path: string[]): { root: Folder, folder: Folder } {
        let root = this.translations.clone;
        let folder = root;
        for (const folderName of path) {
            let child: Folder = folder.getChildByName(folderName) as Folder;

            if (child === undefined) {
                throw new Error('Subfolder with name ' + folderName + ' does not exist in folder ' + folder.name + '.');
            }

            const clone = child.clone;
            folder.children[folder.children.indexOf(child)] = clone;
            folder = clone;
        }
        return {root, folder};
    }

    removeTranslation(t: Translation) {
        const {root, folder} = this.clonePath(t.path);
        let translation = folder.findTranslationByOldName(t.oldName);
        folder.children.splice(folder.children.indexOf(translation), 1);
        return this.modify({translations: root, editingTranslation: null});
    }

    modifyFolder(f: Folder): TranslationsState {
        const {folder, root} = this.clonePath(f.fullPath);

        return this.modify({translations: root});
    }
}
