import {ReactElement} from 'react';
import {VariantType} from "notistack";

export type SecurityDTO = {
    allowPrivate: boolean;
    jwtToken: string;
    loginErrorCode: string;
    allowRegistration: boolean;
}

export class Message {
    constructor(public text: ReactElement | string, public variant: VariantType) {
    };
}
