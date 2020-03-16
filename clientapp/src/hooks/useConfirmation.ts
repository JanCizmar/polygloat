import {container} from 'tsyringe';
import {GlobalActions} from '../store/global/globalActions';
import {ConfirmationDialogProps} from "../component/common/ConfirmationDialog";

export const useConfirmation = (defaultOptions: ConfirmationDialogProps = {}) => {
    const globalActions = container.resolve(GlobalActions);

    return (options: ConfirmationDialogProps) => {
        globalActions.openConfirmation.dispatch({...options, ...defaultOptions});
    };
};
