import {singleton} from "tsyringe";

type Listener = {
    type: string
    callback: (data) => void
};

type Message = {
    data: any,
    type: string
}

type PgEvent = {
    data: Message
} & MessageEvent;

@singleton()
export class Messages {
    private listeners: Listener[] = [];
    private listenersPopup: Listener[] = [];

    readonly startListening = () => {
        const receiveMessage = (event: PgEvent) => {
            if (event.source != window) {
                return;
            }
            this.listeners.forEach(listener => {
                if (listener.type == event.data.type) {
                    listener.callback(event.data.data);
                }
            });
        };

        window.addEventListener("message", receiveMessage, false);
        this.startPopupListening();
    };


    readonly startPopupListening = () => {
        this.listen("POPUP_TO_LIB", (data: Message) => {
            this.listenersPopup.forEach(listener => {
                if (data.type == listener.type) {
                    listener.callback(data.data);
                }
            });
        });
    };

    readonly listenPopup = (type: string, callback: (data) => void) => {
        this.listenersPopup.push({type, callback});
    };


    readonly listen = (type: string, callback: (data) => void) => {
        this.listeners.push({type, callback});
    };

    readonly send = (type: string, data?: any) => {
        try {
            window.postMessage({type, data}, window.origin);
        } catch (e) {
            console.warn("Can not send message.", e);
        }
    };
}