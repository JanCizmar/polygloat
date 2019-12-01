import * as React from 'react';
import {makeStyles, Theme} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Box from '@material-ui/core/Box';

interface IndentsProps {
    count: number;
    arrow?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    indent: {
        display: 'inline-flex',
        verticalAlign: 'middle',
        width: 12,
        justifyContent: 'center'
    }
}));


export function Indents(props: IndentsProps) {
    const indents = [];

    const classes = useStyles({});

    for (let i = 0; i < props.count - 1; i++) {
        indents.push(<Box className={classes.indent} key={i}/>);
    }
    indents.push(<Box className={classes.indent} key={props.count}>{props.arrow && <ArrowDropDownIcon/>}</Box>);


    return (
        <React.Fragment>
            {indents}
        </React.Fragment>
    );
}
