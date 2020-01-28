import {AbstractActions, createLoadable} from '../../AbstractActions';
import {singleton} from 'tsyringe';
import {repositoryService} from '../../../service/repositoryService';
import {InvitationDTO} from '../../../service/response.types';

const invitationsLoadName = 'invitationsLoad';
const invitationsDeleteName = 'invitationDelete';

export class RepositoryInvitationState {
    invitationLoading: boolean = false;
    invitationCode: string = null;
    [invitationsLoadName] = createLoadable<InvitationDTO[]>();
    [invitationsDeleteName] = createLoadable<number>();

}

@singleton()
export class RepositoryInvitationActions extends AbstractActions<RepositoryInvitationState> {

    generateCode = this.createPromiseAction('GENERATE_CODE',
        (repositoryId, type) => this.repositoryService.generateInvitationCode(repositoryId, type))
        .build.onPending((state, action) => {
            return {...state, invitationCode: null, invitationLoading: true};
        }).build.onFullFilled((state, action) => {
            return {...state, invitationCode: action.payload, invitationLoading: false};
        }).build.onRejected((state, action) => {
            return {...state, invitationCode: null, invitationLoading: false};
        });
    acceptInvitation = this.createPromiseAction('ACCEPT_INVITATION',
        (code) => this.repositoryService.acceptInvitation(code));
    loadList = this.createLoadableAction(invitationsLoadName, this.repositoryService.getInvitations);
    delete = this.createDeleteAction(invitationsDeleteName, invitationsLoadName, async (id) => {
        await this.repositoryService.deleteInvitation(id);
        return id;
    });

    constructor(private repositoryService: repositoryService) {
        super();
    }

    get prefix(): string {
        return 'REPOSITORY_INVITATION';
    }
}

