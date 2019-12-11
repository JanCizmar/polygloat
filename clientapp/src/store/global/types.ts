import {AbstractState} from '../abstractState';
import {Action} from '../Action';
import {ReactElement} from 'react';

export class GlobalState extends AbstractState {
    hasError: boolean = false;
    messages: Message[] = [];
    activeMessage: Message = null;
}

export class Message {
    constructor(public text: ReactElement | string, public undoAction?: Action) {
    };
}
