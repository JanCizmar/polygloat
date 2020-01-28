import {AbstractActions} from '../AbstractActions';
import {singleton} from 'tsyringe';

export class ErrorState {
    hasError: boolean = false;
}

@singleton()
export class ErrorActions extends AbstractActions<ErrorState> {

    globalError = this.createAction('ERROR', e => e).build.on((state) => ({...state, hasError: true}));

    get prefix(): string {
        return 'ERROR';
    }
}

