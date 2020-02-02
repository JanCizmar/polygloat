import {singleton} from 'tsyringe';
import {Message} from '../store/global/types';
import {Action} from '../store/Action';
import {default as React, ReactElement} from 'react';
import {Box} from '@material-ui/core';
import {green, red} from '@material-ui/core/colors';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone';
import {MessageActions} from '../store/global/messageActions';
import {ErrorResponseDTO} from "./response.types";

@singleton()
export class messageService {
    constructor(private actions: MessageActions) {
    }

    yell(message: ReactElement | string, undoAction?: Action) {
        this.actions.showMessage.dispatch(new Message(message, undoAction));
    }

    success(message: string) {
        this.yell(
            <Box display="flex" alignItems="center">
                <Box display="inline" mr={1}><CheckCircleTwoToneIcon htmlColor={green['500']}/></Box>{message}
            </Box>);
    }

    error(message: string) {
        this.yell(
            <Box display="flex" alignItems="center">
                <Box display="inline" mr={1}><ErrorTwoToneIcon htmlColor={red['500']}/></Box>{message}
            </Box>);
    }

}


