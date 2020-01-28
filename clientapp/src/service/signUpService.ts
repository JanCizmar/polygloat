import {singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {TokenDTO} from './response.types';
import {tokenService} from './tokenService';
import {LINKS} from '../constants/links';
import {messageService} from './messageService';
import {SignUpType} from '../component/security/SignUpView';
import {RedirectionActions} from '../store/global/redirectionActions';
import {GlobalActions} from '../store/global/globalActions';

@singleton()
export class signUpService {
    constructor(private http: ApiHttpService, private tokenService: tokenService,
                private messageService: messageService,
                private redirectionActions: RedirectionActions,
                private globalActions: GlobalActions) {
    }

    public validateEmail = async (email: string): Promise<boolean> => {
        return this.http.post('public/validate_email', email);
    };

    public signUp = async (data: SignUpType): Promise<void> => {
        const request = {...data};
        delete request.passwordRepeat;
        let response = await this.http.post('public/sign_up', request) as TokenDTO;
        this.messageService.success('Thanks for your sign up');
        this.tokenService.setToken(response.accessToken);
        this.globalActions.setJWTToken.dispatch(response.accessToken);
        this.redirectionActions.redirect.dispatch(LINKS.AFTER_LOGIN.build());
    };
}
