import {Message} from './types';
import {AbstractActions} from '../AbstractActions';
import {singleton} from 'tsyringe';

export class MessageState {
    messages: Message[] = [];
    activeMessage: Message = null;
}


@singleton()
export class MessageActions extends AbstractActions<MessageState> {
    showMessage = this.createAction('SHOW_MESSAGE', m => m).build.on(
        (state, action) => {
            state = {...state};
            if (state.activeMessage === null) {
                state.activeMessage = action.payload as Message;
            } else {
                state.messages.push(action.payload as Message);
            }
            return state;
        });
    messageExited = this.createAction('MESSAGE_EXITED', m => m).build.on(state => {
        state = {...state, activeMessage: null};
        if (state.messages.length > 0) {
            let messages = [...state.messages];
            state = {messages: messages, activeMessage: messages.shift()};
        }
        return state;
    });

    constructor() {
        super(new MessageState());
    }

    get prefix(): string {
        return 'MESSAGE';
    }
}

