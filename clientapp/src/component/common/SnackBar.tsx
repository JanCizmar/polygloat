import React, {SyntheticEvent} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {Actions} from '../../store/global/actions';
import {Message} from '../../store/global/types';
import {connect} from 'react-redux';
import {AppState} from '../../store';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        close: {
            padding: theme.spacing(0.5),
        },
    }),
);

interface Props {
    message?: Message;
}

function SnackBar(props: Props) {
    const classes = useStyles({});

    const handleClose = (event: SyntheticEvent | MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        Actions.messageExited.dispatch(props.message);
    };

    const handleExited = () => {
        Actions.messageExited.dispatch(props.message);
    };

    const actions = [
        <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
        >
            <CloseIcon/>
        </IconButton>,
    ];


    if (props.message && props.message.undoAction) {
        actions.unshift(
            <Button key="undo" color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>);
    }

    return (
        <div>
            <Snackbar
                /* Dont know why. https://material-ui.com/components/snackbars/#ConsecutiveSnackbars.tsx */
                key={new Date().getTime()}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={!!props.message}
                autoHideDuration={4000}
                onClose={handleClose}
                onExited={handleExited}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{props.message && props.message.text}</span>}
                action={actions}
            />
        </div>
    );
}

export default connect((state: AppState) => ({message: state.global.activeMessage}))(SnackBar);
