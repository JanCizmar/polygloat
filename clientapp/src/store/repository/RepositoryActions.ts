import {container, singleton} from 'tsyringe';

import {repositoryService} from '../../service/repositoryService';
import {AbstractActions} from '../AbstractActions';
import {RepositoryResponse} from '../../service/response.types';
import {RepositoriesState} from './RepositoriesState';

@singleton()
export class RepositoryActions extends AbstractActions<RepositoriesState> {
    addRepository = this.createAction('ADD_REPOSITORY', () => {
    }).build.on((state) => {
        return {...state, addingRepository: true};
    });
    resetEdit = this.createAction('RESET_EDIT', () => {
    }).build.on(state => (<RepositoriesState> {...state, repositorySaved: false, repositorySaving: false}));
    private service = container.resolve(repositoryService);
    public loadRepositories = this.createPromiseAction<RepositoryResponse[], any>('LOAD_ALL', this.service.getRepositories)
        .build.onFullFilled((state, action) => {
            return {...state, repositories: action.payload, repositoriesLoading: false};
        }).build.onPending((state, action) => {
            return {...state, repositoriesLoading: true};
        });
    editRepository = this.createPromiseAction('EDIT_REPOSITORY', (id, values) => this.service.editRepository(id, values))
        .build.onPending((state) => (<RepositoriesState> {...state, repositorySaving: true}))
        .build.onFullFilled((state) => (<RepositoriesState> {...state, repositorySaved: true, repositorySaving: false}));

    get prefix(): string {
        return 'REPOSITORIES';
    }

}

