import {Actions} from '../store/global/actions';
import {singleton} from 'tsyringe';

@singleton()
export class BaseHttpService {
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
        return fetch(input, init).then((r) => {
            if (r.status >= 400) {
                Actions.globalError.dispatch(new Error('Server responded with error status.'));
                throw new Error('Error status code from server');
            }
            return r;
        }).catch((r) => new Promise((resolve, reject) => {
            Actions.globalError.dispatch(new Error('Server responded with error status.'));
            reject(r);
        }));
    }

    post(input: RequestInfo, body: {}): Promise<Response> {
        return this.fetch(input, {
            body: JSON.stringify(body),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
}
