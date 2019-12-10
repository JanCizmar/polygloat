import {Actions} from '../global/actions';


export const errorHandling =
    () => next => action => {

        if (!(action.payload instanceof Promise)) {
            return next(action);
        }

        action.payload.catch(error => {
            Actions.globalError.dispatch(error);
        });

        return next(action);
    };
