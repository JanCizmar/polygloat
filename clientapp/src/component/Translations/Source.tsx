import * as React from 'react';
import {useState} from 'react';
import TableRow from '@material-ui/core/TableRow';
import {Translation as TranslationType} from '../../store/translation/types';
import {Indents} from '../TreeTable/Indetnts';
import {TableCell} from '../TreeTable/TableCell';
import {Box, makeStyles, Theme} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import {AppState} from '../../store';
import {connect} from 'react-redux';
import {Actions} from '../../store/translation/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmationDialog from '../common/ConfirmationDialog';
import {TranslationsState} from '../../store/translation/DTOs/TrasnlationsState';

interface TranslationProps {
    translationsState: TranslationsState
    translation: TranslationType;
    indentCount: number;
}

function Source(props: TranslationProps) {
    const [translation, setTranslation] = useState(props.translation.clone);

    const useStyles = makeStyles((theme: Theme) => ({
        input: {
            flexGrow: 1
        },
        row: {
            '&:focus': {
                backgroundColor: theme.palette.grey['50']
            },
            '&:hover': {
                backgroundColor: theme.palette.grey['50'],
                cursor: 'pointer'
            },
            outline: 0,
        },
        inputNameCell: {
            borderBottom: 0
        },
        flexWrap: {
            display: 'flex'
        },
        inputNameEditDiv: {
            flexGrow: 1
        },
        loadingOverlay: {
            backgroundColor: theme.palette.action.disabledBackground,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        }
    }));

    const onChange = (l) => (event) => {
        translation.translations[l] = event.target.value;
        setTranslation(translation.clone);
    };

    const onInputChange = (event) => {
        translation.name = event.target.value;
        setTranslation(translation.clone);
    };

    const classes = useStyles({});

    function onEdit() {
        Actions.onEdit.dispatch(props.translation);
    }

    const onSave = () => {
        Actions.onSave.dispatch(translation);
    };

    const onKeyPress = (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            onEdit();
        }
    };

    const onEnterInText = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            onSave();
        }
    };

    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const onDelete = () => {
        setConfirmationOpen(true);
    };

    const onDeleteConfirm = () => {
        setConfirmationOpen(false);
        Actions.onDelete.dispatch(props.translation);
    };

    const langs = props.translationsState.selectedLanguages;

    return !(props.translationsState.editingTranslation === props.translation) ? (
        <React.Fragment>
            <TableBody onClick={onEdit}
                       className={classes.row}
                       tabIndex={0}
                       onKeyPress={onKeyPress}>
                <TableRow>
                    <TableCell colSpan={langs.length} className={classes.inputNameCell}>
                        <Indents count={props.indentCount}/>{props.translation.name}
                    </TableCell>
                </TableRow>
                <TableRow>
                    {langs.map(l => <TableCell key={l} onClick={onEdit}>
                        {l == langs[0] && <Indents count={props.indentCount}/>}
                        {props.translation.translations[l]}
                    </TableCell>)}
                </TableRow>
            </TableBody>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={langs.length} className={classes.inputNameCell}>
                        <Box display="flex">
                            <Box flexGrow={1} display="flex">
                                <Indents count={props.indentCount}/>
                                <TextField
                                    onKeyPress={onEnterInText}
                                    variant="outlined"
                                    className={classes.input} label="name"
                                    onChange={onInputChange}
                                    value={translation.name}
                                />
                            </Box>
                            <Box style={{position: 'relative'}}>
                                {props.translationsState.editLoading &&
                                <Box display="flex" justifyContent='center' alignItems='center' className={classes.loadingOverlay}>
                                    <CircularProgress/></Box>}
                                <Button disabled={props.translationsState.editLoading} color="primary" onClick={onSave}>
                                    <CheckIcon/>
                                </Button>
                                {!translation.isNew && <Button disabled={props.translationsState.editLoading} color="primary"
                                                               onClick={onDelete}><DeleteIcon/></Button>}
                                <Button disabled={props.translationsState.editLoading} color="primary"
                                        onClick={() => Actions.onEditClose.dispatch(props.translation)}><CloseIcon/></Button>
                                <ConfirmationDialog open={confirmationOpen}
                                                    onConfirm={onDeleteConfirm}
                                                    onCancel={() => setConfirmationOpen(false)}/>
                            </Box>
                        </Box>
                    </TableCell>
                </TableRow>
                <TableRow>
                    {langs.map(l => <TableCell key={l}>
                        <div className={classes.flexWrap}>
                            {l == langs[0] && <Indents count={props.indentCount}/>}
                            <TextField
                                onKeyPress={onEnterInText}
                                variant="outlined"
                                autoFocus={langs[0] === l} className={classes.input} label={l} multiline={true}
                                onChange={onChange(l)}
                                value={translation.translations[l]}
                            />
                        </div>
                    </TableCell>)}
                </TableRow>
            </TableBody>
        </React.Fragment>
    );
};

export default connect((state: AppState) => ({translationsState: state.translations}))(Source);
