import {singleton} from 'tsyringe';
import {Folder, Translation} from '../store/translation/types';

const SERVER_URL = 'http://localhost:8080/';
const REPOSITORY_ID = 2;

@singleton()
export class translationService {
    public getTranslations = async (...langs: string[]) =>
        (await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/${langs.join(',')}`)).json();

    async setTranslations(translationData: Translation): Promise<Translation> {
        await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations`, {
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
        return translationData;
    }

    async deleteSource(t: Translation): Promise<Translation> {
        await fetch(`${SERVER_URL}api/public/repository/${REPOSITORY_ID}/translations/${t.pathString}`, {
            method: 'DELETE'
        });
        return t;
    }

    async editFolder(f: Folder) {
        return undefined;
    }

    deleteFolder(f: Folder) {

    }
}
