import {Folder, Translation} from '../store/translation/types';

export class DataTransformation {
    static translationsToArray(translations) {
        const langs = Object.keys(translations);
        const destructed = {};
        for (const lang of langs) {
            DataTransformation.destruct(translations[lang]);
            for (const key of Object.keys(translations[lang])) {
                if (destructed[key] === undefined) {
                    destructed[key] = {};
                }
                destructed[key][lang] = translations[lang][key];
            }
        }
        return DataTransformation.toFolderStructure(destructed);
    }

    private static destruct = (data) => {
        let found = true;
        while (found) {
            found = false;
            for (const key of Object.keys(data)) {
                if (typeof data[key] == 'object') {
                    found = true;
                    for (const innerKey of Object.keys(data[key])) {
                        data[key + '.' + innerKey] = data[key][innerKey];
                    }
                    delete data[key];
                }
            }
        }
    };

    private static toFolderStructure(destructed): Folder {
        const root: Folder = new Folder(null, null);
        for (const key of Object.keys(destructed)) {
            let parent = root;
            const path = key.split('.');
            for (let i = 0; i < path.length; i++) {
                if (i === (path.length - 1)) {
                    let translation = new Translation(path[i], destructed[key], path.slice(0, path.length - 1));
                    parent.children.push(translation);
                    break;
                }

                let childFolder = parent.getChildByName(path[i]);
                if (childFolder === undefined) {
                    childFolder = new Folder(path[i], path.slice(0, i));
                    parent.children.push(childFolder);
                }
                parent = childFolder as Folder;
            }
        }
        return root;
    }

}
