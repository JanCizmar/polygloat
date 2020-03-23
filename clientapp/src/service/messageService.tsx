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
import {VariantType} from "notistack";

@singleton()
export class messageService {
    constructor(private actions: MessageActions) {
    }

    yell(message: ReactElement | string, variant: VariantType) {
        this.actions.showMessage.dispatch(new Message(message, variant));
    }

    success(message: string) {
        this.yell(message, "success");
    }

    error(message: string) {
        this.yell(message, "error");
    }
}


