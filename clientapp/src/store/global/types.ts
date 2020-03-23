import {Action} from '../Action';
import {ReactElement} from 'react';
import {VariantType} from "notistack";

export type SecurityDTO = {
    allowPrivate: boolean;
    jwtToken: string;
    loginErrorCode: string;
}

export class Message {
    constructor(public text: ReactElement | string, public variant: VariantType) {
    };
}
