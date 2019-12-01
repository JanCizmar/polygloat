import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Props {
    open: boolean;
    message?: String = 'Are you sure?';
    confirmButtonText?: string = 'Confirm';
    title?: string = 'Confirmation';

    onCancel?: () => void = () => {
    };

    onConfirm?: () => void = () => {
    };
}

export default function ConfirmationDialog(props: Props) {
    props = {...(new Props()), ...props};

    return open ? (
        <Dialog
            open={props.open}
            onClose={props.onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.onConfirm} color="primary" autoFocus>
                    {props.confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>) : null;
}
