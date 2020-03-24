import * as React from 'react';
import {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, makeStyles, Theme, Tooltip, Typography} from "@material-ui/core";
import {createStyles} from "@material-ui/core/styles";
import {MicroForm} from "../common/form/MicroForm";
import {EasyInput} from "../common/form/fields/EasyInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import {EditIconButton} from "../common/buttons/EditIconButton";
import {TranslationListContext} from "./TtranslationsGridContextProvider";

export interface EditableCellProps {
    initialValue: any,
    validationSchema: Yup.Schema<any>,
    onSubmit: (value: any) => void;
    editEnabled: boolean;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    textBox: {
        // overflowWrap: "anywhere",
        // wordBreak: "break-all",
        maxWidth: "100%",
        // position: "relative"
    },
    editButton: {
        opacity: "0.1",
        padding: 0,/*
        position: "absolute",
        right: 0*/
    }
}));

export const EditableCell: FunctionComponent<EditableCellProps> = (props) => {
    let listContext = useContext(TranslationListContext);

    const [editing, setEditing] = useState(false);
    const [overflow, setOverflow] = useState(false);

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

    let ref = React.createRef<HTMLDivElement>();

    useEffect(() => {
        const onresize = () => {
            if (ref.current) {
                setOverflow(ref.current.scrollWidth > ref.current.clientWidth);
            }
        };

        onresize();

        window.addEventListener("resize", onresize);

        return () => window.removeEventListener('resize', onresize);

    }, [ref]);


    const classes = useStyles({});

    // @ts-ignore
    const textHolder = <Typography noWrap ref={ref}>
        {props.initialValue}
    </Typography>;

    if (!editing) {
        return <Box onClick={handleEdit}
                    style={{cursor: props.editEnabled ? "pointer" : "initial"}} display="flex" alignItems="center" maxWidth="100%" className={classes.textBox}>
            {
                overflow ?
                    <>
                        <Tooltip title={props.initialValue}>{textHolder}</Tooltip>
                        {
                            props.editEnabled && <EditIconButton color="default" className={classes.editButton}/>
                        }
                    </>
                    :
                    <>
                        {textHolder}
                        {
                            props.editEnabled && <EditIconButton color="default" className={classes.editButton}/>
                        }
                    </>
            }
        </Box>
    }

    return (
        <Box flexGrow={1}>
            <MicroForm onSubmit={(v: { value: any }) => props.onSubmit(v.value)} initialValues={{value: props.initialValue || ""}}
                       validationSchema={Yup.object().shape({value: props.validationSchema})}>
                <EasyInput multiline name="value" fullWidth endAdornment={
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
        </Box>
    )
};