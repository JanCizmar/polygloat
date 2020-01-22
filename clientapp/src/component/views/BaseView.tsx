import {default as React, ReactElement} from 'react';
import Grid from '@material-ui/core/Grid';
import {Paper} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export interface BaseViewProps {
    loading?: boolean;
    title: string;
    children: (() => ReactElement) | ReactElement;
    xs?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    md?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    lg?: boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export const BaseView = (props: BaseViewProps) => {
    return (
        <Grid container justify="center" alignItems="center">
            <Grid item xs={props.xs || 12} md={props.md || 12} lg={props.lg || 12}>
                <Paper>
                    {!props.loading ?
                        <Box p={2}>
                            <Typography variant="h4">{props.title}</Typography>
                            {React.isValidElement(props.children) ? props.children : props.children()}
                        </Box>
                        :
                        <Box display="flex" alignItems="center" justifyContent="center" p={4}><CircularProgress/></Box>
                    }
                </Paper>
            </Grid>
        </Grid>
    );
};
