// Select the node that will be observed for mutations
import {CoreHandler} from './handlers/CoreHandler';
import {NodeHelper} from './helpers/NodeHelper';
import {PolygloatService} from './services/polygloatService';
import {PolygloatConfig} from './PolygloatConfig';
import {Properties} from './Properties';
import {container} from 'tsyringe';
import {EventService} from './services/EventService';
import {TranslationParams} from "./Types";
import {PluginManager} from "./toolsManager/PluginManager";

// Start observing the target node for configured mutations
export class Polygloat {
    public properties: Properties = container.resolve(Properties);
    private _service: PolygloatService = container.resolve(PolygloatService);
    private coreHandler: CoreHandler = container.resolve(CoreHandler);
    private eventService: EventService = container.resolve(EventService);
    private pluginManager = container.resolve(PluginManager);

    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    if (!!mutation.target.parentElement) {
                        await this.coreHandler.onNewNodes([mutation.target.parentElement]);
                    }
                }
                if (mutation.type === 'childList') {
                    await this.handleSubtree(mutation.target);
                }
                if (mutation.type === 'attributes') {
                    await this.coreHandler.handleAttribute(mutation);
                }
            }
        });

    private async handleSubtree(target: Node) {
        let nodes: XPathResult = document.evaluate(`./descendant-or-self::*[contains(text(), \'${this.properties.config.inputPrefix}\')]`, target);
        let inputNodes = (target as Element).getElementsByTagName("input");// document.evaluate('.//input', target);
        let polygloatInputs = Array.from(inputNodes)//NodeHelper.nodeListToArray(inputNodes)
            .filter(i => (i as HTMLInputElement).value.indexOf(this.properties.config.inputPrefix) > -1);

        const newNodes = NodeHelper.nodeListToArray(nodes).concat(polygloatInputs);
        if (newNodes.length) {
            console.log(newNodes);
            await this.coreHandler.onNewNodes(newNodes);
        }
    }

    constructor(config: PolygloatConfig) {
        this.properties.config = {...(new PolygloatConfig()), ...config};
        this.properties.config.mode = this.properties.config.mode || this.properties.config.apiKey ? "development" : "production";

        this.properties.currentLanguage = this.properties.config.defaultLanguage;
    }

    public get lang() {
        return this.properties.currentLanguage;
    }

    public set lang(value) {
        this.properties.currentLanguage = value;
        this.eventService.LANGUAGE_CHANGED.emit({lang: value});
    }

    public get service() {
        return this._service;
    }

    public async run(): Promise<void> {
        this.pluginManager.run();
        if (this.properties.config.mode === "development") {
            this.properties.scopes = await this.service.getScopes();
            return await this.manage();
        }
    }

    public get defaultLanguage() {
        return this.properties.config.defaultLanguage;
    }

    translate = async (inputText: string, params: TranslationParams = {}, noWrap: boolean = false): Promise<string> => {
        if (this.properties.config.mode === 'development' && !noWrap) {
            return this.wrap(inputText, params);
        }
        return this.service.replaceParams(await this.service.getTranslation(inputText), params);
    };

    instant = (inputText: string, params: TranslationParams = {}, noWrap: boolean = false): string => {
        if (this.properties.config.mode === 'development' && !noWrap) {
            return this.wrap(inputText, params);
        }
        return this.service.replaceParams(this.service.instant(inputText), params);
    };

    public manage = async () => {
        this.observer.observe(document.body, {attributes: true, childList: true, subtree: true, characterData: true});
        await this.service.getTranslations(this.lang);
    };

    private wrap(inputText: string, params: TranslationParams = {}): string {
        let paramString = Object.entries(params).map(([name, value]) => `${this.escapeParam(name)}:${this.escapeParam(value)}`).join(",");
        paramString = paramString.length ? `:${paramString}` : "";
        return `${this.properties.config.inputPrefix}${this.escapeParam(inputText)}${paramString}${this.properties.config.inputPostfix}`;
    }

    private readonly escapeParam = (string: string) => string.replace(",", "\\,").replace(":", "\\:");

    public get onLangChange() {
        return this.eventService.LANGUAGE_CHANGED;
    }
}

export default Polygloat;