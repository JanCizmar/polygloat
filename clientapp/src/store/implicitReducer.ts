import {singleton} from 'tsyringe';
import {Action, ActionType, PromiseAction} from './Action';
import {AbstractActions} from './AbstractActions';

@singleton()
export class implicitReducer {
    create = <StateType>(initialState: StateType, actions: AbstractActions<any>,
                         customReducers?: (state: StateType, action: ActionType<any>) => StateType) =>
        (state = initialState, action: ActionType<any>): StateType => {
            let abstractActionDef = actions.getAction(action.type);

            if (abstractActionDef instanceof PromiseAction) {
                let promiseActionDef = (abstractActionDef as PromiseAction<any, any, typeof initialState>);
                if (action.type === promiseActionDef.pendingType && typeof promiseActionDef.reducePending === 'function') {
                    return promiseActionDef.reducePending(state, action);
                }
                if (action.type === promiseActionDef.rejectedType && typeof promiseActionDef.reduceRejected === 'function') {
                    return promiseActionDef.reduceRejected(state, action);
                }
                if (action.type === promiseActionDef.fulfilledType && typeof promiseActionDef.reduceFulfilled === 'function') {
                    return promiseActionDef.reduceFulfilled(state, action);
                }
            } else if (abstractActionDef instanceof Action) {
                let actionDef = (abstractActionDef as Action);
                if (action.type === actionDef.type && typeof actionDef.stateModifier === 'function') {
                    return actionDef.stateModifier(state, action);
                }
            }

            return customReducers !== undefined ? customReducers(state, action) : state;
        };
}

