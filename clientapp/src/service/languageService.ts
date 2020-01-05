import {container, singleton} from 'tsyringe';
import {BaseHttpService} from './baseHttpService';
import {messageService} from './messageService';
import {LanguageResponseType} from './response.types';

const SERVER_URL = 'http://localhost:8080/';
const API_URL = `${SERVER_URL}api/`;

const http = container.resolve(BaseHttpService);

const messaging = container.resolve(messageService);

@singleton()
export class languageService {
    public getLanguages = async (repositoryId: number): Promise<LanguageResponseType[]> =>
        (await http.fetch(`${API_URL}repository/${repositoryId}/languages`)).json();
}
