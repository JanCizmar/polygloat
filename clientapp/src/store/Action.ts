import {container} from 'tsyringe';
import {dispatchService} from '../service/dispatchService';

export class Action<PayloadType = any, StateType = any> {
    constructor(public type: string,
                public payloadProvider: (...params: any[]) => PayloadType,
                public stateModifier?: (state: StateType, action: { type: string, payload: PayloadType }) => StateType) {
    };

    dispatch(...params: any[]) {
        container.resolve(dispatchService).dispatch({type: this.type, payload: this.payloadProvider(...params)});
    }
}

export class PromiseAction<T> extends Action<Promise<T>> {

    get fulfilledType() {
        return this.type + '_FULFILLED';
    }

    get pendingType() {
        return this.type + '_PENDING';
    }

    get rejectedType() {
        return this.type + '_REJECTED';
    }
}
