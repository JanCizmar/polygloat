import {singleton} from 'tsyringe';
import {Actions} from '../store/global/actions';
import {Message} from '../store/global/types';
import {Action} from '../store/Action';
import {ReactElement} from 'react';

@singleton()
export class messageService {
    yell(message: ReactElement | string, undoAction?: Action) {
        Actions.showMessage.dispatch(new Message(message, undoAction));
    }
}


