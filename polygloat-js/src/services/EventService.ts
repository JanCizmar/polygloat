import {singleton} from 'tsyringe';

type callback = (data: Object) => void;

@singleton()
export class EventService {
    private _subscriptions: Map<EventType, callback[]> = new Map<EventType, callback[]>();

    private get subscriptions() {
        return this._subscriptions;
    }

    public publish = (type: EventType, data: {} = {}) => {
        if (this.subscriptions.get(type) !== undefined) {
            for (const callback of this.subscriptions.get(type)) {
                callback(data);
            }
        }
    };

    public subscribe = (type: EventType, callback: callback) => {
        this.initType(type);
        this.subscriptions.get(type).push(callback);
    };

    public unsubscribe = (type: EventType, callback: callback) => {
        this.initType(type);
        const index = this._subscriptions.get(type).indexOf(callback);
        if (index > -1) {
            this._subscriptions.get(type).splice(index, 1);
        }
    };

    private initType(type: EventType) {
        if (this.subscriptions.get(type) === undefined) {
            this.subscriptions.set(type, []);
        }
    }
}

export enum EventType {
    TRANSLATION_CHANGED
}
