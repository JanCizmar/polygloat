export class Translation {

    oldName = this.name;
    isNew: boolean = false;

    constructor(public name?: string, public translations?: { [key: string]: string }, public path?: string[]) {
    }

    get pathString() {
        return this.path.join('.');
    }

    /**
     * returns path with translation name as last item
     */
    get fullPath() {
        return [...this.path, this.name];
    }

    get fullPathString() {
        return this.fullPath.join('.');
    }

    get clone(): Translation {
        return Object.assign(new Translation(), this, {path: [...this.path], translations: {...this.translations}});
    }
}

export class Folder {
    children: (Folder | Translation)[] = [];

    expanded?: boolean = true;

    constructor(public name: string, public path: string[]) {
    }

    get pathString() {
        return this.path.join('.');
    }

    /**
     * returns path with folder name as last item
     */
    get fullPath() {
        return [...this.path, this.name];
    }

    get fullPathString() {
        return this.fullPath.join('.');
    }

    getChildByName(name: string): Folder | Translation {
        return this.children.find(c => c.name === name);
    }

    get clone(): Folder {
        const path = this.path === null ? null : [...this.path];
        return Object.assign(new Folder(this.name, this.path), this, {path});
    }


    findTranslationByOldName(oldName: string): Translation {
        let translation: Translation = this.children
            .find(tr => tr instanceof Translation && (tr as Translation).oldName === oldName) as Translation;

        if (translation === undefined) {
            throw new Error('Can not find translation');
        }

        return translation;
    }
}
