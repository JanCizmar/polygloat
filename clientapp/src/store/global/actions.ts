import {Action} from '../Action';
import {GlobalState} from './types';

const PREFIX = 'GLOBAL_';

export class Actions {
    static globalError = new Action<Error, GlobalState>(PREFIX + 'ERROR', (e: Error) => e,
        (state, action) => {
            return {...state, hasError: true};
        });
}

