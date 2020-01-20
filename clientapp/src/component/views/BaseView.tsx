import {default as React, ReactElement} from 'react';
import Grid from '@material-ui/core/Grid';
import {Paper} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

export interface BaseViewProps {
    loading?: boolean;
    title: string;
    children: (() => ReactElement) | ReactElement;
}

export const BaseView = (props: BaseViewProps) => {
    console.log(props.children);
    return (
        <Grid item xs={12} md={12} lg={12}>
            <Paper>
                {!props.loading ?
                    <Box p={2}>
                        <h1>{props.title}</h1>
                        {React.isValidElement(props.children) ? props.children : props.children()}
                    </Box>
                    :
                    <Box display="flex" alignItems="center" justifyContent="center" p={4}><CircularProgress/></Box>
                }
            </Paper>
        </Grid>
    );
};
