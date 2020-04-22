import {default as React, FunctionComponent} from 'react';

import {SadGoatMessage} from "./SadGoatMessage";
import {Box} from "@material-ui/core";

export const EmptyListMessage: FunctionComponent = (props) => {
    return <Box p={8}><SadGoatMessage text="This list is empty. Add something to continue."/></Box>
};