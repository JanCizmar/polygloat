import * as React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Theme} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Box from '@material-ui/core/Box';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

interface IndentsProps {
    count: number;
    arrow?: boolean;
    onToggle?: () => void;
    expanded?: boolean;
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
        indents.push(<Box className={classes.indent} key={i} onClick={props.onToggle}/>);
    }
    indents.push(<Box className={classes.indent} key={props.count} onClick={props.onToggle}>
        {props.arrow && (props.expanded ? <ArrowDropDownIcon/> : <ArrowRightIcon/>)}
    </Box>);


    return (
        <React.Fragment>
            {indents}
        </React.Fragment>
    );
}
