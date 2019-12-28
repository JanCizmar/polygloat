import {container, singleton} from 'tsyringe';
import {Folder, Translation} from '../store/translation/types';
import {BaseHttpService} from './baseHttpService';
import {messageService} from './messageService';

const SERVER_URL = 'http://localhost:8080/';
const REPOSITORY_ID = 1;

const http = container.resolve(BaseHttpService);

const messaging = container.resolve(messageService);

@singleton()
export class translationService {

    public getTranslations = async (...langs: string[]) =>
        (await http.fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/view/${langs.join(',')}`)).json();

    async setTranslations(translationData: Translation): Promise<any> {
        await http.fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations`, {
            body: JSON.stringify({
                path: translationData.pathString,
                translations: translationData.translations,
                oldSourceName: translationData.oldName,
                newSourceName: translationData.name
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        messaging.success('Translation saved');
        return translationData;
    }

    async deleteSource(t: Translation): Promise<any> {
        await http.fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/${t.fullPathString}`, {
            method: 'DELETE'
        });
        messaging.success('Translation deleted');
        return t;
    }

    async editFolder(oldFolder: Folder, newFolder: Folder) {
        const folderToBody = (f: Folder) => ({path: f.pathString, name: f.name});

        await http.fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/folders`, {
            method: 'POST',
            body: JSON.stringify({
                oldFolder: folderToBody(oldFolder),
                newFolder: folderToBody(newFolder)
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        messaging.success('Folder saved');
        return newFolder;
    }

    async deleteFolder(f: Folder) {
        await http.fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/folders/${f.fullPathString}`, {
            method: 'DELETE'
        });
        messaging.success('Folder deleted');
        return f;
    }
}
