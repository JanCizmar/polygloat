import {Folder as FolderType} from '../../store/translation/types';
import * as React from 'react';
import {useState} from 'react';
import TableRow from '@material-ui/core/TableRow';
import Source from './Source';
import {makeStyles, Theme} from '@material-ui/core';
import {Indents} from '../TreeTable/Indetnts';
import {TableCell} from '../TreeTable/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {Actions} from '../../store/translation/actions';
import Box from '@material-ui/core/Box';
import {AppState} from '../../store';
import {connect} from 'react-redux';
import Input from '@material-ui/core/Input';
import {FolderActions} from './FolderActions';
import {TranslationsState} from '../../store/translation/DTOs/TrasnlationsState';

interface FolderProps {
    folder: FolderType;
    indentCount: number;
    languages: string[];
    translations: TranslationsState;
}

const useStyles = makeStyles((theme: Theme) => ({
    folder: {
        backgroundColor: theme.palette.grey[50]
    }
}));


export const Folder = connect((state: AppState) => ({translations: state.translations}))((props: FolderProps) => {
    const classes = useStyles({});

    const onToggle = () => Actions.onFolderToggle.dispatch(props.folder);

    const [folder, setFolder] = useState(props.folder.clone);

    const isEdited = props.translations.editingFolder === props.folder;

    function onChange(e) {
        folder.name = e.target.value;
        setFolder(folder.clone);
    }

    console.log('rendering');

    const folderRow = props.folder.name !== null &&
        <TableBody>
            <TableRow className={classes.folder}>
                <TableCell colSpan={props.languages.length}>
                    <Box display="flex">
                        <Box flexGrow={1} display="flex" alignItems="center">
                            <Indents count={props.indentCount} arrow={true} onToggle={onToggle} expanded={props.folder.expanded}/>
                            {isEdited ?
                                <Input autoFocus inputProps={{
                                    'aria-label': 'Folder name',
                                }} value={folder.name} onChange={onChange}/> : props.folder.name}
                        </Box>
                        <FolderActions isEdited={isEdited} folder={folder} oldFolder={props.folder}/>
                    </Box>
                </TableCell>
            </TableRow>
        </TableBody>;

    //sort to make translations leading
    props.folder.children.sort((a, b) => {
        let ab = a instanceof FolderType;
        let bb = b instanceof FolderType;
        return (ab === bb) ? 0 : ab ? 1 : -1;
    });

    const childRows = props.folder.children.map(c =>
        c instanceof FolderType ?
            <Folder
                {...props}
                indentCount={props.indentCount + 1}
                key={c.name}
                folder={c as FolderType}
            />
            :
            <Source indentCount={props.indentCount + 1}
                    translation={c} key={c.name}/>);

    return (
        <React.Fragment>
            {folderRow}{props.folder.expanded && childRows}
        </React.Fragment>
    );
});

