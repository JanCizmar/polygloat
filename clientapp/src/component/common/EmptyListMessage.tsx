import {default as React, FunctionComponent} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from "@material-ui/core/styles/createStyles";
import {Theme, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import SadGoat from '../../svgs/sadGoat.svg'

interface FullPageLoadingProps {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {
            filter: "grayscale(75%) blur(0.3px)",
            opacity: "0.2",

        },
    }),
);

export const EmptyListMessage: FunctionComponent<FullPageLoadingProps> = (props) => {
    const classes = useStyles({});

    return (
        <>
            <Box p={8} className={classes.box} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                <SadGoat width={200}/>
                <Box p={4}>
                    <Typography>This list is empty. Add something to continue.</Typography>
                </Box>
            </Box>
        </>
    );
};