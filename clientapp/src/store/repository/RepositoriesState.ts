import {RepositoryDTO} from '../../service/response.types';

export class RepositoriesState {
    repositoriesLoading: boolean = true;
    repositories: RepositoryDTO[];
    repositorySaving: boolean = false;
    repositorySaved: boolean = false;
}
