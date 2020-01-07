import * as React from 'react';
import {useEffect, useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {AppState} from '../../store';
import {connect} from 'react-redux';

import {Paper} from '@material-ui/core';
import {Folder} from './Folder';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {Actions} from '../../store/translation/actions';
import {TranslationsState} from '../../store/translation/DTOs/TrasnlationsState';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

interface TranslationsTableProps {
    translations: TranslationsState
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    folder: {
        backgroundColor: theme.palette.grey[50]
    },
    languageSelect: {
        minWidth: 200,
    }
}));

function TranslationsTable(props: TranslationsTableProps) {
    const allLangs = props.translations.allLanguages;

    const [menuLangs, setMenuLangs] = useState(props.translations.selectedLanguages);

    //update selected languages on redux change
    useEffect(() => {
        setMenuLangs(props.translations.selectedLanguages);
    }, [props.translations.selectedLanguages]);

    useEffect(() => {
        //change param to repository id
        Actions.loadLanguages.dispatch(1);
        Actions.loadTranslations.dispatch(searchValue, null);
    }, []);

    const classes = useStyles({});

    const [searchValue, setSearchValue] = useState('');
    const [oldSearchValue, setOldSearchValue] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (oldSearchValue !== searchValue) {
                Actions.loadTranslations.dispatch(searchValue, menuLangs);
                setOldSearchValue(searchValue);
            }
        }, 1000);
        return () => clearTimeout(handler);
    }, [searchValue]);

    function onSearchChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setSearchValue(e.target.value);
    }

    function onLanguageMenuExit() {
        Actions.loadTranslations.dispatch(searchValue, menuLangs);
    }

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 300,
                width: 250,
            },
        },
        onExit: onLanguageMenuExit
    };

    function langsChange(e: React.ChangeEvent<{ name?: string; value: unknown }>) {
        setMenuLangs(e.target.value as string[]);
    }

    return (
        <React.Fragment>
            <Box mb={2}>
                <Paper>
                    {!props.translations.settingsPanelLoading ?
                        <Box p={1} display="flex">
                            <Box flexGrow={1}>
                                <TextField value={searchValue} onChange={onSearchChange} label="Search"
                                           InputProps={{
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <SearchIcon/>
                                                   </InputAdornment>
                                               ),
                                           }}/>

                            </Box>
                            <Box display="flex" alignItems="right">
                                <FormControl>
                                    <InputLabel id="languages">Languages</InputLabel>
                                    <Select
                                        labelId="languages"
                                        id="languages-select"
                                        multiple
                                        value={menuLangs}
                                        onChange={e => langsChange(e)}
                                        input={<Input/>}
                                        renderValue={selected => (selected as string[]).join(', ')}
                                        MenuProps={MenuProps}
                                        className={classes.languageSelect}

                                    >
                                        {allLangs.map(lang => (
                                            <MenuItem key={lang} value={lang}>
                                                <Checkbox checked={menuLangs.indexOf(lang) > -1}/>
                                                <ListItemText primary={lang}/>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        :
                        <Box className={classes.loading} p={1}><CircularProgress/></Box>}
                </Paper>
            </Box>
            <Paper className={classes.root}>
                {!props.translations.translationsLoading ?
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {//props.translations.allLanguages.map(l => <TableCell key={l}>{l}</TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <Folder
                            indentCount={0}
                            languages={props.translations.selectedLanguages}
                            folder={props.translations.translations}
                        />
                    </Table>
                    :
                    <Box className={classes.loading} p={4}><CircularProgress/></Box>
                }
            </Paper>
        </React.Fragment>);
}


export default connect((state: AppState) => ({translations: state.translations}))(TranslationsTable);
