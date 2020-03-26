import {container, singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {PermissionDTO, RepositoryDTO} from './response.types';

const http = container.resolve(ApiHttpService);

@singleton()
export class repositoryService {
    constructor() {
    }

    public getRepositories = async (): Promise<RepositoryDTO[]> => (await http.get(`repositories`));

    public editRepository = async (id: number, values: {}) => (await http.postNoJson(`repositories/edit`,
        {...values, repositoryId: id})).json();

    public createRepository = async (values: Partial<RepositoryDTO>) => (await http.postNoJson(`repositories`, values)).json();

    public deleteRepository = async (id) => http.delete('repositories/' + id);

    public getPermissions = async (repositoryId): Promise<PermissionDTO[]> => http.get('permission/list/' + repositoryId);

    public deletePermission = async (invitationId): Promise<void> => http.delete('permission/' + invitationId);

    loadRepository = (id): Promise<RepositoryDTO> => http.get("repositories/" + id);
}
