import {Folder, Translation} from '../store/translation/types';

class FileDTO {
    fullPath: String;
    translations: {};
    source: boolean;
}

export class DataTransformation {
    public static toFolderStructure(files: FileDTO[]): Folder {
        const root: Folder = new Folder(null, null);
        let parent = root;
        for (const file of files) {
            this.addToRoot(root, file);
        }
        return root;
    }

    private static addToRoot(root: Folder, file: FileDTO) {
        let fullPath = file.fullPath.split('.');
        if (file.source) {
            let parent: Folder = root;
            let name: string = fullPath.pop();
            for (const pathItem of fullPath) {
                let child = parent.getChildByName(pathItem);
                if (child === undefined) {
                    child = new Folder(pathItem, parent.fullPath);
                    parent.children.push(child);
                }
                parent = child as Folder;
            }
            let translation = new Translation(name, file.translations, fullPath);
            parent.children.push(translation);
        }

    }
}
