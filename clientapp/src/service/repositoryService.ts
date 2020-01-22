import {container, singleton} from 'tsyringe';
import {BaseHttpService} from './baseHttpService';
import {RepositoryDTO} from './response.types';
import {CONFIG} from '../config';

const API_URL = CONFIG.API_URL;


const http = container.resolve(BaseHttpService);

@singleton()
export class repositoryService {
    public getRepositories = async (): Promise<RepositoryDTO[]> => (await http.fetch(`${API_URL}repositories`)).json();

    public editRepository = async (id: number, values: {}) => (await http.post(`${API_URL}repositories/edit`,
        {...values, repositoryId: id})).json();

    public createRepository = async (values: Partial<RepositoryDTO>) => (await http.post(`${API_URL}repositories`, values)).json();
}
