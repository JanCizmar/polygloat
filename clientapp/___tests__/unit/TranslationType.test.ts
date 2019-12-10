import {Folder, Translation} from '../../src/store/translation/types';

describe('Translation type', () => {
    let root: Folder;
    let subfolder = new Folder('sub', root);
    let translation: Translation;

    beforeEach(() => {
        root = new Folder(null, null);
        subfolder = new Folder('sub', root);
        root.children.push(subfolder);
        translation = new Translation('text', {en: 'en', de: 'de'}, subfolder);
        subfolder.children.push(translation);
    });

    test('should copy translation deep', async () => {
        let deepCopy = translation.deepCopy;

        expect(deepCopy).not.toBe(root);

        expect(deepCopy.parent.root).not.toBe(root);

        deepCopy.translations['en'] = 'modified';

        expect(deepCopy.parent.root.children.length).toBe(1);

        expect((deepCopy.parent.root.children[0] as Folder).children.length).toBe(1);

        expect(((deepCopy.parent.root.children[0] as Folder).children[0] as Translation).translations['en']).toBe('modified');
    });

    test('should copy folder deeply', async () => {
        let subsubfolder: Folder = new Folder('subsub', subfolder);
        subfolder.children.push(subsubfolder);
        let parent = subsubfolder.deepCopy;
        let notIn: Folder[] = [subsubfolder, subfolder, root];
        while (parent != null) {
            expect(notIn.indexOf(parent)).toBeLessThan(0);
            for (const folder of notIn) {
                expect(parent.children.indexOf(folder)).toBeLessThan(0);
            }
            parent = parent.parent;
        }
    });
});
