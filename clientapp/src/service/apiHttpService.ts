import {container, singleton} from 'tsyringe';
import {ErrorActions} from '../store/global/errorActions';
import {RedirectionActions} from '../store/global/redirectionActions';
import {LINKS} from '../constants/links';
import {tokenService} from './tokenService';
import {CONFIG} from '../config';

const errorActions = container.resolve(ErrorActions);
const redirectionActions = container.resolve(RedirectionActions);

const API_URL = CONFIG.API_URL;

@singleton()
export class ApiHttpService {
    constructor(private tokenService: tokenService) {
    }

    private static async getResObject(r: Response) {
        const textBody = await r.text();
        try {
            return JSON.parse(textBody);
        } catch (e) {
            return textBody;
        }
    }

    fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
        return new Promise((resolve, reject) => {
            if (this.tokenService.getToken()) {
                init = init || {};
                init.headers = init.headers || {};
                init.headers = {...init.headers, 'Authorization': 'Bearer ' + this.tokenService.getToken()};
            }
            fetch(API_URL + input, init).then((r) => {
                if (r.status == 401 || r.status == 403) {
                    console.warn('Redirecting to login - unauthorized user');
                    redirectionActions.redirect.dispatch(LINKS.LOGIN.build());
                }
                if (r.status >= 500) {
                    console.log(r.json().then(r => console.log(r)));
                    errorActions.globalError.dispatch(new Error('Server responded with error status.'));
                    throw new Error('Error status code from server');
                }
                //use input error, result should contain json
                if (r.status >= 400 && r.status <= 500) {
                    ApiHttpService.getResObject(r).then(b => reject(b));
                } else {
                    resolve(r);
                }
            });
        });
    }

    async get<T>(url): Promise<T> {
        return ApiHttpService.getResObject(await this.fetch(url));
    }

    async post<T>(url, body): Promise<T> {
        return ApiHttpService.getResObject(await (this.postNoJson(url, body)));
    }

    async delete<T>(url): Promise<T> {
        return ApiHttpService.getResObject(await this.fetch(url, {method: 'DELETE'}));
    }

    postNoJson(input: RequestInfo, body: {}): Promise<Response> {
        return this.fetch(input, {
            body: JSON.stringify(body),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
}
