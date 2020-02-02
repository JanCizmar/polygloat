import {singleton} from 'tsyringe';
import {repositoryService} from '../../../service/repositoryService';
import {PermissionDTO} from '../../../service/response.types';
import {AbstractLoadableActions, StateWithLoadables} from "../../AbstractLoadableActions";

const listName = 'permissionsList';
const deleteName = 'permissionDelete';

export class RepositoryPermissionState extends StateWithLoadables<RepositoryPermissionActions> {
}

@singleton()
export class RepositoryPermissionActions extends AbstractLoadableActions<RepositoryPermissionState> {

    loadableDefinitions = {
        list: this.createLoadableDefinition(this.repositoryService.getPermissions),
        delete: this.createDeleteDefinition("list", async (id) => {
            await this.repositoryService.deletePermission(id);
            return id;
        })
    };

    constructor(private repositoryService: repositoryService) {
        super(new RepositoryPermissionState());
    }

    get prefix(): string {
        return 'REPOSITORY_PERMISSION';
    }
}

