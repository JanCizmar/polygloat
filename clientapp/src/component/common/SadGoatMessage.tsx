import {default as React, FunctionComponent} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from "@material-ui/core/styles/createStyles";
import {Theme, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import SadGoat from '../../svgs/sadGoat.svg'

interface SadGoatMessageProps {
    text: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        goat: {
            filter: "grayscale(75%) blur(0.3px)",
            opacity: "0.09",
        },
        text: {
            opacity: "0.3"
        }
    }),
);

export const SadGoatMessage: FunctionComponent<SadGoatMessageProps> = (props) => {
    const classes = useStyles({});

    return (
        <>
            <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                <Box className={classes.goat}>
                    <SadGoat width={200}/>
                </Box>
                {props.text &&
                <Box p={4} className={classes.text}>
                    <Typography>{props.text}</Typography>
                </Box>}
            </Box>
        </>
    );
};