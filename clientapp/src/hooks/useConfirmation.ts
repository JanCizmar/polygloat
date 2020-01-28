import {container} from 'tsyringe';
import {GlobalActions} from '../store/global/globalActions';

export const useConfirmation = (content: string, title: string) => {
    const globalActions = container.resolve(GlobalActions);

    const onConfirmed = (callback: () => void) => {
        console.log('calling hook');
        globalActions.openConfirmation.dispatch(title, content, callback);
    };

    return {
        confirm: onConfirmed
    };
};
