import {default as React, ReactNode} from 'react';
import Grid from '@material-ui/core/Grid';
import {Paper} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {BoxLoading} from '../common/BoxLoading';

export interface BaseViewProps {
    loading?: boolean;
    title: ReactNode;
    children: (() => ReactNode) | ReactNode;
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
                        <Box p={4}>
                            <Typography variant="h4">{props.title}</Typography>
                            {typeof props.children === 'function' ? props.children() : props.children}
                        </Box>
                        :
                        <BoxLoading/>
                    }
                </Paper>
            </Grid>
        </Grid>
    );
};
