import * as React from 'react';
import {useContext} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Box, CircularProgress, FormHelperText, Theme, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {green} from '@material-ui/core/colors';
import clsx from 'clsx';
import {TranslationDialogContext} from "./TranslationDialog";
import {LanguageSelect} from "./LanguageSelect";
import {TranslationFields} from "./TranslationFields";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            margin: theme.spacing(1),
            position: 'relative',
        },
        buttonSuccess: {
            backgroundColor: green[500],
            '&:hover': {
                    backgroundColor: green[700],
                },
            },
            buttonProgress: {
                color: green[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -12,
                marginLeft: -12,
            },
            source: {
                wordBreak: "break-all"
            }
        }
    )
);

export default () => {
    let context = useContext(TranslationDialogContext);

    const classes = useStyles({});

    const buttonClassname = clsx({
        [classes.buttonSuccess]: context.success,
    });

    return (
        <div>
            <Dialog open={context.open} onClose={context.onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
                <DialogTitle id="form-dialog-title">Translate text</DialogTitle>
                <DialogContent>
                    <Box mb={4} className={classes.source}><Typography>{context.input}</Typography></Box>
                    <LanguageSelect/>
                    <TranslationFields/>
                    {
                        context.editDisabled &&
                        <FormHelperText error>
                            Modification is restricted due to missing translations.edit scope in current api key settings.
                        </FormHelperText>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={context.onClose} color="default">
                        Cancel
                    </Button>
                    <div className={classes.wrapper}>
                        <Button
                            color="primary"
                            className={buttonClassname}
                            disabled={context.saving || context.editDisabled}
                            onClick={context.onSave}
                        >
                            {context.success ? 'Saved' : 'Save'}
                        </Button>
                        {context.saving && <CircularProgress size={24} className={classes.buttonProgress}/>}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}
