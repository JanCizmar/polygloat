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
    }
}));

function TranslationsTable(props: TranslationsTableProps) {
    const allLangs = ['en', 'de'];

    const [langs, setLangs] = useState(['en', 'de']);

    useEffect(() => {
        Actions.loadTranslations.dispatch(searchValue, langs);
    }, []);

    const classes = useStyles({});

    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => Actions.loadTranslations.dispatch(searchValue, langs), 1000);
        return () => clearTimeout(handler);
    }, [searchValue]);

    function onSearchChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setSearchValue(e.target.value);

    }

    const MenuProps = {
        PaperProps: {
            style: {
                //maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    function langsChange(e: React.ChangeEvent<{ name?: string; value: unknown }>) {
        setLangs(e.target.value as string[]);
    }

    return (
        <React.Fragment>
            <Box mb={2}>
                <Paper>
                    <Box p={1}>
                        <TextField value={searchValue} onChange={onSearchChange} label="Search"
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <SearchIcon/>
                                           </InputAdornment>
                                       ),
                                   }}/>

                        <FormControl>
                            <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
                            <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                value={langs}
                                onChange={e => langsChange(e)}
                                input={<Input/>}
                                renderValue={selected => (selected as string[]).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {allLangs.map(lang => (
                                    <MenuItem key={lang} value={lang}>
                                        <Checkbox checked={langs.indexOf(lang) > -1}/>
                                        <ListItemText primary={lang}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>
            </Box>
            <Paper className={classes.root}>
                {props.translations.translationsLoaded ?
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {//props.translations.languages.map(l => <TableCell key={l}>{l}</TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <Folder
                            indentCount={0}
                            languages={props.translations.languages}
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
