import {container, singleton} from 'tsyringe';

import {repositoryService} from '../../service/repositoryService';
import {RepositoryDTO} from '../../service/response.types';
import {LINKS} from "../../constants/links";
import {AbstractLoadableActions, createLoadable, Loadable, StateWithLoadables} from "../AbstractLoadableActions";

export class RepositoriesState extends StateWithLoadables<RepositoryActions> {
    repositoriesLoading: boolean = true;
    repositories: RepositoryDTO[];
}

@singleton()
export class RepositoryActions extends AbstractLoadableActions<RepositoriesState> {
    constructor() {
        super(new RepositoriesState());
    }

    private service = container.resolve(repositoryService);

    public loadRepositories = this.createPromiseAction<RepositoryDTO[], any>('LOAD_ALL', this.service.getRepositories)
        .build.onFullFilled((state, action) => {
            return {...state, repositories: action.payload, repositoriesLoading: false};
        }).build.onPending((state, action) => {
            return {...state, repositoriesLoading: true};
        });


    loadableDefinitions = {
        editRepository: this.createLoadableDefinition<null>((id, values) => this.service.editRepository(id, values), null,
            "Successfully edited!", LINKS.REPOSITORIES),
        createRepository: this.createLoadableDefinition((values) => this.service.createRepository(values),
            null, "Repository created", LINKS.REPOSITORIES),
        repository: this.createLoadableDefinition(this.service.loadRepository),
        deleteRepository: this.createLoadableDefinition(this.service.deleteRepository, (state, action): RepositoriesState =>
            (
                {...state, loadables: {...state.loadables, repository: {...createLoadable()} as Loadable<RepositoryDTO>}}
            ), "Repository deleted!")
    };


    get prefix(): string {
        return 'REPOSITORIES';
    }

}
