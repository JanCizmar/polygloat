import {Action} from '../Action';
import {GlobalState, Message} from './types';

const PREFIX = 'GLOBAL_';

export class Actions {
    static globalError = new Action<Error, GlobalState>(PREFIX + 'ERROR', (e: Error) => e,
        (state, action) => {
            return state.modify({hasError: true});
        });

    static showMessage = new Action<Message, GlobalState>(PREFIX + 'SHOW_MESSAGE', m => m,
        (state, action) => {
            state = state.modify({});
            if (state.activeMessage === null) {
                state.activeMessage = action.payload as Message;
            } else {
                state.messages.push(action.payload as Message);
            }
            return state;
        });

    static messageExited = new Action<Message, GlobalState>(PREFIX + 'MESSAGE_EXITED', m => m,
        (state, action) => {
            state = state.modify({activeMessage: null});
            if (state.messages.length > 0) {
                let messages = [...state.messages];
                state = state.modify({messages: messages, activeMessage: messages.shift()});
            }
            return state;
        });
}

