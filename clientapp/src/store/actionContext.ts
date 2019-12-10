import {singleton} from 'tsyringe';

//todo
@singleton()
export class ActionContext {
    public registerReducer;
    private reducers: { [name: string]: [] } = {};
}
