import {Folder as FolderType} from '../../store/translation/types';
import * as React from 'react';
import TableRow from '@material-ui/core/TableRow';
import Translation from './Translation';
import {makeStyles, Theme} from '@material-ui/core';
import {Indents} from '../TreeTable/Indetnts';
import {TableCell} from '../TreeTable/TableCell';
import TableBody from '@material-ui/core/TableBody';

interface FolderProps {
    folder: FolderType;
    indentCount: number;
    languages: string[];
}

const useStyles = makeStyles((theme: Theme) => ({
    folder: {
        backgroundColor: theme.palette.grey[50]
    }
}));


export function Folder(props: FolderProps) {
    const classes = useStyles({});

    const folderRow = props.folder.name !== null &&
        <TableBody>
            <TableRow className={classes.folder}>
                <TableCell colSpan={props.languages.length}>
                    <Indents count={props.indentCount} arrow={true}/>
                    {props.folder.name}
                </TableCell>
            </TableRow>
        </TableBody>;

    const childRows = props.folder.children.sort(c => c instanceof Folder ? -1 : 1)
        .map(c =>
            c instanceof FolderType ?
                <Folder
                    {...props}
                    indentCount={props.indentCount + 1}
                    key={c.name}
                    folder={c as FolderType}
                />
                :
                <Translation indentCount={props.indentCount + 1}
                             translation={c} key={c.name}/>);

    return (
        <React.Fragment>
            {folderRow}{childRows}
        </React.Fragment>
    );
}
