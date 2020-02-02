import * as React from 'react';
import {FunctionComponent, useContext, useState} from 'react';
import {Box, Theme} from "@material-ui/core";
import {createStyles} from "@material-ui/core/styles";
import {MicroForm} from "../common/form/MicroForm";
import {TranslationListContext} from "./TranslationsGrid";
import {EasyInput} from "../common/form/fields/EasyInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import {EditIconButton} from "../common/buttons/EditIconButton";

export interface EditableCellProps {
    initialValue: any,
    validationSchema: Yup.Schema<any>,
    onSubmit: (value: any) => void;
    editEnabled: boolean;
}

const useStyles = createStyles((theme: Theme) => {

});

export const EditableCell: FunctionComponent<EditableCellProps> = (props) => {
    let listContext = useContext(TranslationListContext);

    const [editing, setEditing] = useState(false);

    const handleEdit = () => {
        if (props.editEnabled) {
            //reset previous edit
            listContext.resetEdit();
            //change global reset edit function to this reset
            listContext.resetEdit = () => setEditing(false);
            //edit current translation
            setEditing(true);
        }
    };

    const handleCancel = () => {
        listContext.resetEdit();
    };


    if (!editing) {
        return <Box onClick={handleEdit} style={{cursor: props.editEnabled ? "pointer" : "initial"}} display="flex">
            <Box flexGrow={1} alignItems="center" display="flex">
                {props.initialValue} {props.editEnabled && <EditIconButton color="default" style={{opacity: 0.1}}/>}
            </Box>
        </Box>
    }

    return (
        <MicroForm onSubmit={(v: { value: any }) => props.onSubmit(v.value)} initialValues={{value: props.initialValue}}
                   validationSchema={Yup.object().shape({value: props.validationSchema})}>
            <EasyInput multiline name="value" endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        edge="end"
                        color="primary"
                        type="submit"
                    >
                        <CheckIcon/>
                    </IconButton>
                    <IconButton
                        onClick={handleCancel}
                        edge="end"
                        color="secondary"
                    >
                        <CloseIcon/>
                    </IconButton>
                </InputAdornment>
            }/>
        </MicroForm>
    )
};