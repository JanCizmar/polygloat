import * as React from 'react';
import {FunctionComponent, useState} from "react";
import {Box, Checkbox, ListItemText, MenuItem, Select, Theme} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {useRepositoryLanguages} from "../../../hooks/useRepositoryLanguages";
import {container} from "tsyringe";
import {TranslationActions} from "../../../store/repository/TranslationActions";
import Input from "@material-ui/core/Input";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {messageService} from "../../../service/messageService";

export interface LanguagesMenuProps {
    // context: 'creation' | 'view'
}

const actions = container.resolve(TranslationActions);

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        minWidth: 200
    }
}));

const messaging = container.resolve(messageService);

export const LanguagesMenu: FunctionComponent<LanguagesMenuProps> = (props) => {

    const classes = useStyles({});

    let languageDTOS = useRepositoryLanguages();

    let selected = actions.useSelector(s => s.selectedLanguages);

    const [localSelected, setLocalSelected] = useState(selected);

    const langsChange = (e) => {
        if (e.target.value < 1) {
            messaging.error("Set at least one language!");
            return;
        }
        setLocalSelected(e.target.value);
    };


    const onLanguageMenuExit = () => {
        actions.select.dispatch(localSelected);
    };

    const menuProps = {
        PaperProps: {
            style: {
                maxHeight: 300,
                width: 250,
            },
        },
        onExit: onLanguageMenuExit
    };

    return (
        <Box display="flex" alignItems="right">
            <FormControl>
                <InputLabel id="languages">Languages</InputLabel>
                <Select
                    labelId="languages"
                    id="languages-select"
                    multiple
                    value={localSelected}
                    onChange={e => langsChange(e)}
                    input={<Input className={classes.input}/>}
                    renderValue={selected => (selected as string[]).join(', ')}
                    MenuProps={menuProps}
                >
                    {languageDTOS.map(lang => (
                        <MenuItem key={lang.abbreviation} value={lang.abbreviation}>
                            <Checkbox checked={localSelected.indexOf(lang.abbreviation) > -1}/>
                            <ListItemText primary={lang.abbreviation}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
};