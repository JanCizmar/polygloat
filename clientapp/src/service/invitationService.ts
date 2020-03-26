import {container, singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {ErrorResponseDTO, InvitationDTO} from './response.types';
import {RedirectionActions} from '../store/global/redirectionActions';
import {LINKS} from '../constants/links';
import {messageService} from './messageService';
import {tokenService} from "./tokenService";
import {invitationCodeService} from "./invitationCodeService";
import {GlobalActions} from "../store/global/globalActions";


const http = container.resolve(ApiHttpService);


@singleton()
export class invitationService {
    constructor(private redirectActions: RedirectionActions, private messaging: messageService, private tokenService: tokenService,
                private invitationCodeService: invitationCodeService) {
    }

    public generateInvitationCode = async (repositoryId: number, type: string): Promise<string> => await http.post('repositories/invite', {
        repositoryId, type
    });

    public acceptInvitation = async (code: string): Promise<void> => {
        if (!this.tokenService.getToken()) {
            this.invitationCodeService.setCode(code);
            //circular dependency
            container.resolve(GlobalActions).allowRegistration.dispatch();
            this.redirectActions.redirect.dispatch(LINKS.LOGIN.build());
            return;
        }

        try {
            await http.get('invitation/accept/' + code);
            this.messaging.success('Invitation successfully accepted');

        } catch (e) {
            if ((<ErrorResponseDTO>e).code) {
                this.messaging.error(e.code);
            }
        }
        this.redirectActions.redirect.dispatch(LINKS.REPOSITORIES.build());
    };

    public getInvitations = async (repositoryId): Promise<InvitationDTO[]> => http.get('invitation/list/' + repositoryId);

    public deleteInvitation = async (invitationId): Promise<void> => http.delete('invitation/' + invitationId);
}