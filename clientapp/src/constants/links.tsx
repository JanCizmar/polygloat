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

    public build(params?: { [key: string]: string | number }): string {
        let link = this.template;
        params = params ? params : {};
        for (const param of Object.keys(params)) {
            let param1 = params[param];
            link = link.replace(`:${param}`, params[param].toString());
        }
        return link;
    }
}

const p = (param: string) => {
    return `:${param}`;
};

export enum PARAMS {
    REPOSITORY_ID = 'repositoryId',
    LANGUAGE_ID = 'languageId',

}

export class LINKS {
    static REPOSITORIES = Link.ofRoot('repositories');

    static REPOSITORY = Link.ofParent(LINKS.REPOSITORIES, p(PARAMS.REPOSITORY_ID));

    static REPOSITORY_EDIT = Link.ofParent(LINKS.REPOSITORIES, 'edit/' + p(PARAMS.REPOSITORY_ID));

    static REPOSITORY_LANGUAGES = Link.ofParent(LINKS.REPOSITORY, 'languages');


    static REPOSITORY_LANGUAGES_EDIT = Link.ofParent(LINKS.REPOSITORY_LANGUAGES, 'edit/' + p(PARAMS.LANGUAGE_ID));

    static REPOSITORY_TRANSLATIONS = Link.ofParent(LINKS.REPOSITORY, 'translations');
};
