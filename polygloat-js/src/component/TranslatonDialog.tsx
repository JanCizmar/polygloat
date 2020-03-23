import * as React from 'react';
import {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Box,
    Checkbox,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Theme,
    Typography
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {TranslationData} from '../DTOs/TranslationData';
import {PolygloatService} from '../services/polygloatService';
import {green} from '@material-ui/core/colors';
import clsx from 'clsx';
import {container} from 'tsyringe';
import {EventService, EventType} from '../services/EventService';
import {Properties} from "../Properties";

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
            source: {
                wordBreak: "break-all"
            }
        }
    )
);

export default function TranslationDialog(props: DialogProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [translationData, setTranslationData] = useState<TranslationData>(null);
    const service = container.resolve(PolygloatService);
    const properties = container.resolve(Properties);

    const handleChange = (abbr) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSuccess(false);
        translationData.translations[abbr] = event.target.value;
        setTranslationData({...translationData});
    };

    const loadTranslations = (languages?: string[]) => service.getSourceTranslations(props.input, languages).then(result => {
        setTranslationData(result);
        setLoading(false);
    });

    useEffect(() => {
        if (props.open) {
            setLoading(true);
            setSuccess(false);
            setError(null);
            loadTranslations(service.preferredLanguages);
            if (availableLanguages === undefined) {
                service.getLanguages().then(l => {
                    setAvailableLanguages(l);
                });
            }
        }
    }, [props.open]);

    const onSave = async () => {
        setSaving(true);
        try {
            await service.setTranslations(translationData);
            container.resolve(EventService).publish(EventType.TRANSLATION_CHANGED, translationData);
            setSuccess(true);
            setError(null);
            props.onClose();
        } catch (e) {
            setError("error");
            throw e;
        } finally {
            setSaving(false);
        }
    };

    const classes = useStyles({});

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });


    const disabled = () => !service.isKeyAllowed("translations.edit");

    const [availableLanguages, setAvailableLanguages] = useState(undefined);

    const [languages, setLanguages] = useState(service.preferredLanguages || [properties.currentLanguage]);

    const inputRef = React.createRef<HTMLElement>();

    const [labelWidth, setLabelWidth] = useState(0);

    useEffect(() => setLabelWidth(inputRef.current ? inputRef.current.clientWidth : 0), [inputRef]);

    return (
        <div>
            <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
                <DialogTitle id="form-dialog-title">Translate text</DialogTitle>
                <DialogContent>
                    <Box pb={2} className={classes.source}><Typography>{props.input}</Typography></Box>
                    {availableLanguages && <Box pb={2}>
                        <FormControl fullWidth variant="outlined">
                            {/*
                            // @ts-ignore */}
                            <InputLabel id="demo-mutiple-checkbox-label" ref={inputRef}>Select languages</InputLabel>
                            <Select labelId="demo-mutiple-checkbox-label"
                                    id="demo-mutiple-checkbox"
                                    multiple
                                    value={languages}
                                    onChange={(e) => {
                                        const newValue = e.target.value as string[];
                                        if (newValue.length) {
                                            setLanguages(newValue);
                                            service.preferredLanguages = newValue;
                                            loadTranslations(newValue)
                                        }
                                    }}
                                    variant="outlined"
                                    input={<OutlinedInput labelWidth={labelWidth}/>}
                                    renderValue={selected => (selected as string[]).join(', ')}
                            >
                                {availableLanguages.map(name => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={languages.indexOf(name) > -1}/>
                                        <ListItemText primary={name}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box> || <CircularProgress size="small"/>}

                    {loading ? <div style={{textAlign: 'center'}}><CircularProgress/></div> :
                        Object.keys(translationData.translations).map(key =>
                            <TextField
                                disabled={disabled()}
                                key={key}
                                id="filled-multiline-flexible"
                                label={key}
                                multiline
                                value={translationData.translations[key]}
                                onChange={handleChange(key)}
                                style={{width: '100%'}}
                                variant="outlined"
                                margin="normal"
                                error={!!error}
                                helperText={error}
                            />)
                    }
                    {
                        disabled() &&
                        <FormHelperText error>
                            Modification is restricted due to missing translations.edit scope in current api key settings.
                        </FormHelperText>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="default">
                        Cancel
                    </Button>
                    <div className={classes.wrapper}>
                        <Button
                            color="primary"
                            className={buttonClassname}
                            disabled={saving || disabled()}
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
