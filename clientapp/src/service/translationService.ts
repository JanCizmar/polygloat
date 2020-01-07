import {container, singleton} from 'tsyringe';
import {Folder, Translation} from '../store/translation/types';
import {BaseHttpService} from './baseHttpService';
import {messageService} from './messageService';
import {TranslationsDataResponse} from './response.types';

const SERVER_URL = 'http://localhost:8080/';
const REPOSITORY_ID = 1;
const API_URL = `${SERVER_URL}api/`;

const http = container.resolve(BaseHttpService);

const messaging = container.resolve(messageService);

@singleton()
export class translationService {
    public getTranslations = async (search, langs: string[]): Promise<TranslationsDataResponse> =>
        (await http.fetch(`${API_URL}repository/${REPOSITORY_ID}/translations/view` +
            `?search=${search}${langs ? '&languages=' + langs.join(',') : ''}`)).json();

    async setTranslations(translationData: Translation): Promise<any> {
        await http.fetch(`${API_URL}repository/${REPOSITORY_ID}/translations`, {
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
        messaging.success('Translation saved');
        return translationData;
    }

    async deleteFile(t: Translation): Promise<any> {
        await http.fetch(`${API_URL}repository/${REPOSITORY_ID}/file/${t.fullPathString}`, {
            method: 'DELETE'
        });
        messaging.success('Translation deleted');
        return t;
    }

    async moveFile(oldFolder: Folder, newFolder: Folder) {
        const fileToBody = (f: Folder) => (f.fullPathString);

        await http.fetch(`${API_URL}repository/${REPOSITORY_ID}/file`, {
            method: 'POST',
            body: JSON.stringify({
                oldFileFullPath: fileToBody(oldFolder),
                newFileFullPath: fileToBody(newFolder)
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        messaging.success('Folder saved');
        return newFolder;
    }

    async deleteFolder(f: Folder) {
        await http.fetch(`${API_URL}repository/${REPOSITORY_ID}/folders/${f.fullPathString}`, {
            method: 'DELETE'
        });
        messaging.success('Folder deleted');
        return f;
    }
}
