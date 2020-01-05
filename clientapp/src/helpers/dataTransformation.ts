import {Folder, Translation} from '../store/translation/types';
import {FileResponse} from '../service/response.types';

export class DataTransformation {
    public static toFolderStructure(files: FileResponse[]): Folder {
        const root: Folder = new Folder(null, null);
        let parent = root;
        for (const file of files) {
            this.addToRoot(root, file);
        }
        return root;
    }

    private static addToRoot(root: Folder, file: FileResponse) {
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
