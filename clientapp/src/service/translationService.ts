import {singleton} from 'tsyringe';
import {Folder, Translation} from '../store/translation/types';
import {ApiHttpService} from './apiHttpService';
import {messageService} from './messageService';
import {TranslationsDataResponse} from './response.types';

const REPOSITORY_ID = 1;

@singleton()
export class translationService {
    constructor(private http: ApiHttpService, private messaging: messageService) {
    }

    public getTranslations = async (search, langs: string[]): Promise<TranslationsDataResponse> =>
        (await this.http.fetch(`repository/${REPOSITORY_ID}/translations/view` +
            `?search=${search}${langs ? '&languages=' + langs.join(',') : ''}`)).json();

    async setTranslations(translationData: Translation): Promise<any> {
        await this.http.fetch(`repository/${REPOSITORY_ID}/translations`, {
            body: JSON.stringify({
                path: translationData.pathString,
                translations: translationData.translations,
                oldSourceText: translationData.oldName,
                newSourceText: translationData.name
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        this.messaging.success('Translation saved');
        return translationData;
    }

    async deleteFile(t: Translation): Promise<any> {
        await this.http.fetch(`repository/${REPOSITORY_ID}/file/${t.fullPathString}`, {
            method: 'DELETE'
        });
        this.messaging.success('Translation deleted');
        return t;
    }

    async moveFile(oldFolder: Folder, newFolder: Folder) {
        const fileToBody = (f: Folder) => (f.fullPathString);

        await this.http.fetch(`repository/${REPOSITORY_ID}/file`, {
            method: 'POST',
            body: JSON.stringify({
                oldFileFullPath: fileToBody(oldFolder),
                newFileFullPath: fileToBody(newFolder)
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.messaging.success('Folder saved');
        return newFolder;
    }

    async deleteFolder(f: Folder) {
        await this.http.fetch(`repository/${REPOSITORY_ID}/folders/${f.fullPathString}`, {
            method: 'DELETE'
        });
        this.messaging.success('Folder deleted');
        return f;
    }
}
