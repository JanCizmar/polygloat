// Select the node that will be observed for mutations
import * as React from 'react';
import {CoreHandler} from './handlers/CoreHandler';
import {NodeHelper} from './helpers/NodeHelper';
import {PolygloatService} from './services/polygloatService';
import {PolygloatConfig} from './PolygloatConfig';
import {Mode, Properties} from './Properties';
import {container} from 'tsyringe';
import {EventService, EventType} from './services/EventService';

// Start observing the target node for configured mutations
export class Polygloat {
    private static instance: Polygloat;
    public properties: Properties = container.resolve(Properties);
    private _service: PolygloatService = container.resolve(PolygloatService);
    private coreHandler: CoreHandler = container.resolve(CoreHandler);
    private eventService: EventService = container.resolve(EventService);
    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                //console.log(mutation);
                if (mutation.type === 'childList') {
                    let nodes: XPathResult =
                        document.evaluate(`.//*[contains(text(), \'${this.properties.config.inputPrefix}\')]`, mutation.target);
                    let inputNodes = document.evaluate('.//input', mutation.target);

                    let polygloatInputs = NodeHelper.nodeListToArray(inputNodes)
                        .filter(i => (i as HTMLInputElement).value.indexOf(this.properties.config.inputPrefix) > -1);

                    //todo: wrap with iterable
                    await this.coreHandler.onNewNodes(NodeHelper.nodeListToArray(nodes).concat(polygloatInputs));
                }
                if (mutation.type === 'attributes') {
                    await this.coreHandler.handleAttribute(mutation);
                }
            }
        });

    constructor(lang: string, config: PolygloatConfig) {
        this.properties.currentLanguage = lang;
        this.properties.config = config;
    }

    public get lang() {
        return this.properties.currentLanguage;
    }

    public static set lang(value) {
        this.getInstance().properties.currentLanguage = value;
        this.getInstance().eventService.publish(EventType.TRANSLATION_CHANGED, {lang: value});
    }

    public get service() {
        return this._service;
    }

    public static run(lang: string, config: PolygloatConfig = {}): Promise<void> {
        return this.getInstance(lang, config).manage();
    };

    static translate = async (inputText: string, noWrap: boolean = false): Promise<string> => {
        if (Polygloat.getInstance().properties.mode == Mode.DEVELOP && !noWrap) {
            return Polygloat.getInstance().wrap(inputText);
        }
        return await Polygloat.getInstance().service.getTranslation(inputText);
    };

    public static getInstance(lang?: string, config: PolygloatConfig = new PolygloatConfig()): Polygloat {
        if (this.instance == null) {
            this.instance = new Polygloat(lang, {...(new PolygloatConfig()), ...config});
        }
        return this.instance;
    }

    // noinspection JSUnusedGlobalSymbols
    public manage = async () => {
        this.observer.observe(document.body, {attributes: true, childList: true, subtree: true});
        await this.service.getTranslations(this.lang);
    };

    replace = (text: string) => this.service.replace(text, this.lang);

    private wrap(inputText: string): string {
        return `${this.properties.config.inputPrefix}${inputText}${this.properties.config.inputPostfix}`;
    }
}
