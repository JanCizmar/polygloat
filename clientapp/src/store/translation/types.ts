// Describing the shape of the chat's slice of state

export interface Message {
    user: string;
    message: string;
    timestamp: number;
}

export class Translation {
    constructor(public name: string, public translations: { [key: string]: string }, public parent: Folder = null) {
    }

    get path(): string[] {
        let path = [];
        if (this.parent !== null) {
            path = this.parent.path;
        }
        path.push(this.name);
        return path;
    }

    get pathString(): string {
        return this.path.join('.');
    }
}

export class Folder {
    children: (Folder | Translation)[] = [];

    expanded?: boolean = true;

    constructor(public name: string, public parent) {
    }

    get path(): string[] {
        const path = [];
        let parent: Folder = this;
        while (parent !== null && parent.name !== null) {
            path.unshift(parent.name);
            parent = parent.parent;
        }
        return path;
    }

    get root(): Folder {
        let parent: Folder = this;
        while (!parent.isRoot) {
            parent = parent.parent;
        }
        return parent;
    }

    get isRoot(): boolean {
        return this.parent == null;
    }

    getChildByName(name: string): Folder | Translation {
        return this.children.find(c => c.name === name);
    }
}
