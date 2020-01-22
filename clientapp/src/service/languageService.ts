import {container, singleton} from 'tsyringe';
import {BaseHttpService} from './baseHttpService';
import {LanguageDTO} from './response.types';
import {CONFIG} from '../config';

const API_URL = CONFIG.API_URL;

const http = container.resolve(BaseHttpService);

@singleton()
export class languageService {
    public getLanguages = async (repositoryId: number): Promise<LanguageDTO[]> =>
        (await http.fetch(`${API_URL}repository/${repositoryId}/languages`)).json();

    async editLanguage(repositoryId: number, data: LanguageDTO): Promise<LanguageDTO> {
        return await (await http.post(`${API_URL}repository/${repositoryId}/languages/edit`, data)).json();
    }
}
