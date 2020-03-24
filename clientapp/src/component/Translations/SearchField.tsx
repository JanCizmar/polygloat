import * as React from 'react';
import {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, TextField} from "@material-ui/core";
import {TranslationListContext} from "./TtranslationsGridContextProvider";

export const SearchField: FunctionComponent = (props) => {
    const listContext = useContext(TranslationListContext);

    const [search, setSearch] = useState(listContext.listLoadable.data ? listContext.listLoadable.data.params.search || "" : "");
    const [oldSearch, setOldSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            if (oldSearch !== search) {
                listContext.loadData(search);
                setOldSearch(search);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);


    return (
        <Box flexGrow={1}>
            <TextField id="standard-search"
                       label="Search"
                       type="search"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}/>
        </Box>
    );
};