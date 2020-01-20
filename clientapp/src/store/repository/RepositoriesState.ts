import {RepositoryResponse} from '../../service/response.types';

export class RepositoriesState {
    repositoriesLoading: boolean = true;
    repositories: RepositoryResponse[];
    repositorySaving: boolean = false;
    repositorySaved: boolean = false;
}
