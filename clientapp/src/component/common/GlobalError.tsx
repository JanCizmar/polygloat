import * as React from 'react';
import {createStyles, makeStyles, Paper, Theme} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import {GlobalError as GlobalErrorError} from "../../error/GlobalError";

export default function GlobalError(props: { error: GlobalErrorError }) {
    return (
        <Container maxWidth='lg'>
            <Box mt={5}>
                <Paper>
                    <Box>
                        <Box p={4}>
                            <Box mb={5}>
                                <Typography variant="h2"><SentimentDissatisfiedIcon/>Unexpected error occurred</Typography>
                            </Box>
                            {props.error.publicInfo &&
                            <Box mb={5}>
                                <Typography variant="h4">{props.error.publicInfo}</Typography>
                            </Box>}

                            <Typography variant='body1'>The error is logged and we will fix this soon. Now please try to reload this page.</Typography>

                            <Box mt={5}>
                                {props.error.debugInfo &&
                                <>
                                    <Typography variant="h5">Debug information</Typography>
                                    <pre>
                                    {props.error.debugInfo}
                                </pre>
                                </>
                                }

                                <Typography variant="h5">Stack trace</Typography>

                                <pre>
                                {props.error.stack}
                                </pre>

                                {props.error.e &&
                                <pre>
                                    {props.error.e && props.error.e.stack}
                                </pre>
                                }
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
