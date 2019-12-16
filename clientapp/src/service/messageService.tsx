import {singleton} from 'tsyringe';
import {Actions} from '../store/global/actions';
import {Message} from '../store/global/types';
import {Action} from '../store/Action';
import {default as React, ReactElement} from 'react';
import {Box} from '@material-ui/core';
import {green} from '@material-ui/core/colors';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';

@singleton()
export class messageService {
    yell(message: ReactElement | string, undoAction?: Action) {
        Actions.showMessage.dispatch(new Message(message, undoAction));
    }

    success(message: string) {
        this.yell(
            <Box display="flex" alignItems="center">
                <Box display="inline" mr={1}><CheckCircleTwoToneIcon htmlColor={green['500']}/></Box>{message}
            </Box>);
    }
}


