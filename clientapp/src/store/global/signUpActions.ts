import {singleton} from 'tsyringe';
import {signUpService} from '../../service/signUpService';
import {AbstractLoadableActions, StateWithLoadables} from "../AbstractLoadableActions";

export class SignUpState extends StateWithLoadables<SignUpActions> {
}

@singleton()
export class SignUpActions extends AbstractLoadableActions<SignUpState> {
    readonly loadableDefinitions = {
        signUp: this.createLoadableDefinition(this.service.signUp)
    };

    constructor(private service: signUpService) {
        super(new SignUpState());
    }

    get prefix(): string {
        return 'SIGN_UP';
    }
}

