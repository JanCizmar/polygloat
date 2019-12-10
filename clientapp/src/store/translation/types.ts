// Describing the shape of the chat's slice of state

export interface Message {
    user: string;
    message: string;
    timestamp: number;
}

export class Translation {

    oldName = this.name;
    isNew: boolean = false;

    constructor(public name?: string, public translations?: { [key: string]: string }, public path?: string[]) {
    }

    get pathString() {
        return this.path.join('.');
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

    getChildByName(name: string): Folder | Translation {
        return this.children.find(c => c.name === name);
    }

    get clone() {
        return Object.assign(new Folder(this.name, this.path), this);
    }
}
