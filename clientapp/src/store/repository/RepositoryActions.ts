import {container, singleton} from 'tsyringe';

import {repositoryService} from '../../service/repositoryService';
import {RepositoryDTO} from '../../service/response.types';
import {LINKS} from "../../constants/links";
import {AbstractLoadableActions, StateWithLoadables} from "../AbstractLoadableActions";

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


    get loadableDefinitions() {
        return {
            editRepository: this.createLoadableDefinition<null>((id, values) => this.service.editRepository(id, values), null,
                "Successfully edited!", LINKS.REPOSITORIES),
            createRepository: this.createLoadableDefinition((values) => this.service.createRepository(values),
                null, "Repository created", LINKS.REPOSITORIES),
            repository: this.createLoadableDefinition(this.service.loadRepository, null),
            deleteRepository: this.createLoadableDefinition(this.service.deleteRepository, null, "Repository deleted", LINKS.REPOSITORIES),
        }
    };


    get prefix(): string {
        return 'REPOSITORIES';
    }

}
