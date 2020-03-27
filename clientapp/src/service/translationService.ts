import {singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {messageService} from './messageService';
import {TranslationsDataResponse, TranslationsObject} from './response.types';
import {TranslationCreationValue} from "../component/Translations/TranslationCreationDialog";
import {selectedLanguagesService} from "./selectedLanguagesService";


@singleton()
export class translationService {
    constructor(private http: ApiHttpService, private messaging: messageService, private selectedLanguagesService: selectedLanguagesService) {
    }

    public getTranslations = async (repositoryId: number, langs?: string[], search?: string, limit?: number, offset?: number): Promise<TranslationsDataResponse> => {
        const result: TranslationsDataResponse = (await this.http.get(`repository/${repositoryId}/translations/view`,
            {search, languages: langs ? langs.join(',') : null, limit, offset}));

        this.selectedLanguagesService.setForRepository(repositoryId, new Set(result.params.languages));

        return result;
    };

    createSource = (repositoryId: number, value: TranslationCreationValue) => this.http.post(`repository/${repositoryId}/sources/create`, {
        sourceFullPath: value.source,
        translations: value.translations
    });

    set = (repositoryId: number, dto: { sourceFullPath: string, translations: { [abbreviation: string]: string } }) =>
        this.http.post(`repository/${repositoryId}/translations`, dto);

    editSource = (repositoryId: number, dto: { oldFullPathString: string, newFullPathString: string }) =>
        this.http.post(`repository/${repositoryId}/sources/edit`, dto);

    setTranslations = (repositoryId: number, dto: { sourceFullPath: string, translations: TranslationsObject }) =>
        this.http.post(`repository/${repositoryId}/translations/set`, dto);

    deleteSource = (repositoryId: number, ids: number[]) =>
        this.http.delete(`repository/${repositoryId}/sources`, ids);

}
