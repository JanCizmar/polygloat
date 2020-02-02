import {AbstractActions} from '../AbstractActions';
import {singleton} from 'tsyringe';
import {signUpService} from '../../service/signUpService';

export class SignUpState{
    signUpLoading = false;
    signUpError = null;
}

@singleton()
export class SignUpActions extends AbstractActions<SignUpState> {
    signUpSubmit = this.createPromiseAction('SIGN_UP_SUBMIT',
        (v) => this.service.signUp(v))
        .build.onPending((state, action) => {
            return <SignUpState> {...state, signUpLoading: true, signUpError: null};
        }).build.onFullFilled((state, action) => {
            return <SignUpState> {...state, signUpLoading: false, signUpError: null};
        }).build.onRejected((state, action) => {
            return <SignUpState> {...state, signUpLoading: false, signUpError: action.payload.code};
        });

    constructor(private service: signUpService) {
        super(new SignUpState());
    }

    get prefix(): string {
        return 'SIGN_UP';
    }
}

