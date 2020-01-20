import {container, singleton} from 'tsyringe';
import {BaseHttpService} from './baseHttpService';
import {messageService} from './messageService';
import {RepositoryResponse} from './response.types';

const SERVER_URL = 'http://localhost:8080/';
const API_URL = `${SERVER_URL}api/`;

const http = container.resolve(BaseHttpService);

const messaging = container.resolve(messageService);

@singleton()
export class repositoryService {
    public getRepositories = async (): Promise<RepositoryResponse[]> => (await http.fetch(`${API_URL}repositories`)).json();

    public editRepository = async (id: number, values: {}) => (await http.post(`${API_URL}repositories/edit`,
        {...values, repositoryId: id})).json();
}
