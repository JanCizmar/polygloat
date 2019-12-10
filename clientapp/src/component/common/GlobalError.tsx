import * as React from 'react';
import {createStyles, makeStyles, Paper, Theme} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3, 2),
        },
    }),
);

export default function GlobalError() {
    const classes = useStyles({});

    return (
        <Container maxWidth='sm'>
            <Paper className={classes.root}>
                <Box>
                    <Box>
                        <Typography variant="h4"><SentimentDissatisfiedIcon/>Unexpected error occurred</Typography>
                        <Typography variant='body1'>The error is logged and we will fix this soon. Now please try to reload this page.
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
