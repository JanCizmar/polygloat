import {Actions} from './actions';
import {Action} from '../Action';
import {GlobalState} from './types';

export function globalReducer(
    state = new GlobalState(),
    action: { type: string, payload: any }
): GlobalState {
    switch (action.type) {
        default:
            for (const key of Object.keys(Actions)) {
                if (Actions[key] instanceof Action) {
                    let actionDef = (Actions[key] as Action);
                    if (action.type === actionDef.type && typeof actionDef.stateModifier === 'function') {
                        return (Actions[key] as Action).stateModifier(state, action);
                    }
                }
            }
            return state;
    }
}
