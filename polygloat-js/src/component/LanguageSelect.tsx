import * as React from 'react';
import {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Checkbox, CircularProgress, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select} from "@material-ui/core";
import {TranslationDialogContext} from "./TranslationDialog";

export const LanguageSelect: FunctionComponent = () => {
    let context = useContext(TranslationDialogContext);

    const [labelWidth, setLabelWidth] = useState(0);

    const inputRef = React.createRef<HTMLLabelElement>();

    useEffect(() => setLabelWidth(inputRef.current ? inputRef.current.clientWidth : 0), [inputRef]);

    return <>
        {context.availableLanguages && <Box pb={2}>
            <FormControl fullWidth variant="outlined">

                <InputLabel id="demo-mutiple-checkbox-label" ref={inputRef}>Select languages</InputLabel>
                <Select labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={[...context.selectedLanguages]}
                        onChange={(e) => context.onSelectedLanguagesChange(new Set(e.target.value as string[]))}
                        variant="outlined"
                        input={<OutlinedInput labelWidth={labelWidth}/>}
                        renderValue={(selected: string[]) => selected.join(', ')}
                >
                    {[...context.availableLanguages].map(name => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={context.selectedLanguages.has(name)}/>
                            <ListItemText primary={name}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box> || <CircularProgress size="small"/>}

    </>
};