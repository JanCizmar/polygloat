export class Link {
    _template: string;

    /**
     * Constructor is private to avoid creating of unrefactorable links
     * @param template
     */
    private constructor(template: string) {
        this._template = template;
    }

    get template(): string {
        return this._template;
    }

    /**
     * creates root in link
     * @param itemTemplate e.g. ":userId" or "users"
     */
    static ofRoot(itemTemplate: string) {
        return this.ofParent(null, itemTemplate);
    }

    /**
     * adds to parent link and returns new link
     * @param link
     * @param itemTemplate
     */
    static ofParent(link: Link, itemTemplate: string): Link {
        return new Link(`${link ? link.template : ''}/${itemTemplate}`);
    }

    public build(params: { [key: string]: string | number }): string {
        let link = this.template;
        for (const param of Object.keys(params)) {
            let param1 = params[param];
            link = link.replace(`:${param}`, param1.toString());
        }
        return link;
    }
}

export const LINKS = {
    REPOSITORIES: Link.ofRoot('repositories'),
    REPOSITORY: Link.ofParent(this.REPOSITORIES, ':repositoryId'),
    REPOSITORY_TRANSLATIONS: Link.ofParent(this.REPOSITORY, 'translations')
};
