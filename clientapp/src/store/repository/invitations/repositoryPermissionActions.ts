import {AbstractActions, createLoadable} from '../../AbstractActions';
import {singleton} from 'tsyringe';
import {repositoryService} from '../../../service/repositoryService';
import {PermissionDTO} from '../../../service/response.types';

const listName = 'permissionsList';
const deleteName = 'permissionDelete';

export class RepositoryPermissionState {
    [listName] = createLoadable<PermissionDTO[]>();
    [deleteName] = createLoadable<number>();
}

@singleton()
export class RepositoryPermissionActions extends AbstractActions<RepositoryPermissionState> {

    loadList = this.createLoadableAction(listName, this.repositoryService.getPermissions);
    delete = this.createDeleteAction(deleteName, listName, async (id) => {
        await this.repositoryService.deletePermission(id);
        return id;
    });

    constructor(private repositoryService: repositoryService) {
        super();
    }

    get prefix(): string {
        return 'REPOSITORY_PERMISSION';
    }
}

