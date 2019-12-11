import {container} from 'tsyringe';
import {messageService} from '../../service/messageService';
import * as React from 'react';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import {Box} from '@material-ui/core';
import {green} from '@material-ui/core/colors';

const messaging = container.resolve(messageService);

export const successMessage =
    () => next => action => {

        if (!(action.payload instanceof Promise)) {
            return next(action);
        }

        if (action.successMessage) {
            (action.payload as Promise<any>).then(() => {
                messaging.yell(
                    <Box display="flex" alignItems="center">
                        <Box display="inline" mr={1}><CheckCircleTwoToneIcon htmlColor={green['500']}/></Box>{action.successMessage}
                    </Box>);
            });
        }
        return next(action);
    };
