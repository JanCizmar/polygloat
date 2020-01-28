import {singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {CONFIG} from '../config';
import {ErrorResponseDTO, TokenDTO} from './response.types';
import {tokenService} from './tokenService';
import {API_LINKS} from '../constants/apiLinks';
import {LINKS} from '../constants/links';
import {messageService} from './messageService';
import {RedirectionActions} from '../store/global/redirectionActions';

const API_URL = CONFIG.API_URL;

interface ResetPasswordPostRequest {
    email: string,
    code: string,
    password: string,
}

@singleton()
export class securityService {
    constructor(private http: ApiHttpService, private tokenService: tokenService, private messageService: messageService,
                private redirectionActions: RedirectionActions) {
    }

    public authorizeOAuthLogin = async (type: string, code: string): Promise<TokenDTO> => {
        let response = await fetch(`${API_URL}public/authorize_oauth/${type}/${code}`);
        return this.handleLoginResponse(response);
    };

    logout() {
        this.tokenService.disposeToken();
    }

    async login(v: { username: string, password: string }): Promise<TokenDTO> {
        const response = await fetch(`${API_URL}public/generatetoken`, {
            body: JSON.stringify(v),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        return this.handleLoginResponse(response);
    }

    public resetPasswordRequest = (email: string) => {
        const url = `${API_LINKS.RESET_PASSWORD_REQUEST}`;
        return this.http.post<never>(url, {email: email, callbackUrl: LINKS.RESET_PASSWORD.buildWithOrigin()});
    };

    public resetPasswordValidate = (email: string, code: string) => {
        const url = `${API_LINKS.RESET_PASSWORD_VALIDATE}/${encodeURIComponent(email)}/${encodeURIComponent(code)}`;
        return this.http.get<never>(url);
    };

    public resetPasswordSet = async (email: string, code: string, password: string): Promise<void> => {
        const url = `${API_LINKS.RESET_PASSWORD_SET}`;
        const res = await this.http.post<never>(url, <ResetPasswordPostRequest> {
            email, code, password
        });
        this.messageService.success('Password successfully reset');
        return res;
    };

    public saveAfterLoginLink = (afterLoginLink: object) => {
        localStorage.setItem('afterLoginLink', JSON.stringify(afterLoginLink));
    };

    public getAfterLoginLink = (): object => {
        let link = localStorage.getItem('afterLoginLink');
        if (link) {
            return JSON.parse(link);
        }
        return null;
    };

    public removeAfterLoginLink = () => {
        return localStorage.removeItem('afterLoginLink');
    };

    private async handleLoginResponse(response): Promise<TokenDTO> {
        if (response.status >= 400) {
            throw <ErrorResponseDTO> await response.json();
        }

        const tokenDTO: TokenDTO = await response.json();

        this.tokenService.setToken(tokenDTO.accessToken);

        return tokenDTO;
    }

}
