import * as React from 'react';
import {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CircularProgress, Theme} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {TranslationData} from '../DTOs/TranslationData';
import {PolygloatService} from '../services/polygloatService';
import {green} from '@material-ui/core/colors';
import clsx from 'clsx';
import {container} from 'tsyringe';
import {EventService, EventType} from '../services/EventService';

interface DialogProps {
    open: boolean;
    input: string;

    onClose(): void;
}

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
    }));

export default function TranslationDialog(props: DialogProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [translationData, setTranslationData] = useState<TranslationData>(null);
    const service = container.resolve(PolygloatService);
    const handleChange = (abbr) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSuccess(false);
        translationData.translations[abbr] = event.target.value;
        setTranslationData({...translationData});
    };

    useEffect(() => {
        if (props.open) {
            setLoading(true);
            setSuccess(false);
            service.getSourceTranslations(props.input).then(result => {
                setTranslationData(result);
                setLoading(false);
            });
        }
    }, [props.open]);

    const onSave = async () => {
        setSaving(true);
        await service.setTranslations(translationData);
        container.resolve(EventService).publish(EventType.TRANSLATION_CHANGED, translationData);
        setSaving(false);
        setSuccess(true);
        props.onClose();
    };

    const classes = useStyles({});

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });


    return (
        <div>
            <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Translate text "{props.input}"</DialogTitle>
                <DialogContent>
                    {loading ? <div style={{textAlign: 'center'}}><CircularProgress/></div> :
                        Object.keys(translationData.translations).map(key =>
                            <TextField
                                key={key}
                                id="filled-multiline-flexible"
                                label={key}
                                multiline
                                rowsMax="4"
                                value={translationData.translations[key]}
                                onChange={handleChange(key)}
                                style={{width: '100%'}}
                                margin="normal"
                                variant="filled"
                            />)
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary">
                        Cancel
                    </Button>
                    <div className={classes.wrapper}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={buttonClassname}
                            disabled={saving}
                            onClick={onSave}
                        >
                            {success ? 'Saved' : 'Save'}
                        </Button>
                        {saving && <CircularProgress size={24} className={classes.buttonProgress}/>}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}