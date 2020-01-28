import {container, singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {LanguageDTO} from './response.types';

const http = container.resolve(ApiHttpService);

@singleton()
export class languageService {
    public getLanguages = async (repositoryId: number): Promise<LanguageDTO[]> =>
        (await http.fetch(`repository/${repositoryId}/languages`)).json();

    async editLanguage(repositoryId: number, data: LanguageDTO): Promise<LanguageDTO> {
        return await (await http.postNoJson(`repository/${repositoryId}/languages/edit`, data)).json();
    }
}
