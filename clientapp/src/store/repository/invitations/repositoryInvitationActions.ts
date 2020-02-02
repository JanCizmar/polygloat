import {singleton} from 'tsyringe';
import {repositoryService} from '../../../service/repositoryService';
import {InvitationDTO} from '../../../service/response.types';
import {AbstractLoadableActions, StateWithLoadables} from "../../AbstractLoadableActions";

export class RepositoryInvitationState extends StateWithLoadables<RepositoryInvitationActions> {
    invitationLoading: boolean = false;
    invitationCode: string = null;
}

@singleton()
export class RepositoryInvitationActions extends AbstractLoadableActions<RepositoryInvitationState> {

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


    loadableDefinitions = {
        list: this.createLoadableDefinition(this.repositoryService.getInvitations),
        delete: this.createDeleteDefinition("list", async (id) => {
            await this.repositoryService.deleteInvitation(id);
            return id;
        })
    };

    constructor(private repositoryService: repositoryService) {
        super(new RepositoryInvitationState());
    }

    get prefix(): string {
        return 'REPOSITORY_INVITATION';
    }
}

