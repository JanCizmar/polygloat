import {container, singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {ErrorResponseDTO, InvitationDTO, PermissionDTO, RepositoryDTO} from './response.types';
import {RedirectionActions} from '../store/global/redirectionActions';
import {LINKS} from '../constants/links';
import {messageService} from './messageService';


const http = container.resolve(ApiHttpService);


@singleton()
export class repositoryService {
    constructor(private redirectActions: RedirectionActions, private messaging: messageService) {
    }

    public getRepositories = async (): Promise<RepositoryDTO[]> => (await http.get(`repositories`));

    public editRepository = async (id: number, values: {}) => (await http.postNoJson(`repositories/edit`,
        {...values, repositoryId: id})).json();

    public createRepository = async (values: Partial<RepositoryDTO>) => (await http.postNoJson(`repositories`, values)).json();

    public generateInvitationCode = async (repositoryId: number, type: string): Promise<string> => await http.post('repositories/invite', {
        repositoryId, type
    });

    public acceptInvitation = async (code: string): Promise<void> => {
        try {
            await http.get('invitation/accept/' + code);
            this.messaging.success('Invitation successfully accepted');

        } catch (e) {
            if ((<ErrorResponseDTO> e).code) {
                this.messaging.error(e.code);
            }
        }
        this.redirectActions.redirect.dispatch(LINKS.REPOSITORIES.build());
    };

    public getInvitations = async (repositoryId): Promise<InvitationDTO[]> => http.get('invitation/list/' + repositoryId);

    public deleteInvitation = async (invitationId): Promise<void> => http.delete('invitation/' + invitationId);

    public getPermissions = async (repositoryId): Promise<PermissionDTO[]> => http.get('permission/list/' + repositoryId);

    public deletePermission = async (invitationId): Promise<void> => http.delete('permission/' + invitationId);
}
