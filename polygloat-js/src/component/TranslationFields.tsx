import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {CircularProgress} from "@material-ui/core";
import {TranslationDialogContext} from "./TranslationDialog";
import TextField from "@material-ui/core/TextField";

export const TranslationFields: FunctionComponent = () => {
    let context = useContext(TranslationDialogContext);

    return <>
        {context.loading ? <div style={{textAlign: 'center'}}><CircularProgress/></div> :
            Object.keys(context.translations.translations).map(key =>
                <TextField
                    disabled={context.editDisabled}
                    key={key}
                    id="filled-multiline-flexible"
                    label={key}
                    multiline
                    value={context.translations.translations[key]}
                    onChange={context.onTranslationInputChange(key)}
                    style={{width: '100%'}}
                    variant="outlined"
                    margin="normal"
                    error={!!context.error}
                    helperText={context.error}
                />)
        }
    </>
};