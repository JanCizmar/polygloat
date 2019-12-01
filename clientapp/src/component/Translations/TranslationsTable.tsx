import * as React from 'react';
import {useEffect} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {AppState} from '../../store';
import {connect, useDispatch} from 'react-redux';

import {Paper} from '@material-ui/core';
import {Folder} from './Folder';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {Actions} from '../../store/translation/actions';
import {TranslationTableState} from '../../store/translation/reducers';


interface TranslationsTableProps {
    translations: TranslationTableState
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

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return {name, calories, fat, carbs, protein};
}

function TranslationsTable(props: TranslationsTableProps) {

    useEffect(() => {
        Actions.loadTranslations.dispatch('en', 'de');
    }, []);

    const dispatch = useDispatch();

    const classes = useStyles({});

    return (
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
        </Paper>);
}


export default connect((state: AppState) => ({translations: state.translations}))(TranslationsTable);
