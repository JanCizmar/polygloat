import {singleton} from 'tsyringe';
import {EventEmitter} from "./EventEmitter";

@singleton()
export class EventService {
    public readonly TRANSLATION_CHANGED = new EventEmitter();
    public readonly LANGUAGE_CHANGED = new EventEmitter();
}