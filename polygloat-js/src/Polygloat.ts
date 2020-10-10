import {PolygloatService} from './services/polygloatService';
import {PolygloatConfig} from './PolygloatConfig';
import {Properties} from './Properties';
import {container} from 'tsyringe';
import {EventService} from './services/EventService';
import {TranslationParams} from "./Types";
import {PluginManager} from "./toolsManager/PluginManager";
import {Observer} from "./component/Observer";

export class Polygloat {
    public properties: Properties = container.resolve(Properties);
    private _service: PolygloatService = container.resolve(PolygloatService);
    private eventService: EventService = container.resolve(EventService);
    private pluginManager = container.resolve(PluginManager);
    private observer: Observer;

    constructor(config: PolygloatConfig) {
        this.properties.config = {...(new PolygloatConfig()), ...config};
        this.properties.config.mode = this.properties.config.mode || this.properties.config.apiKey ? "development" : "production";
        this.properties.currentLanguage = this.properties.config.defaultLanguage;
        this.properties.config.watch = this.properties.config.watch === undefined ? this.properties.config.mode === "development" : false;
    }

    public get lang() {
        return this.properties.currentLanguage;
    }

    public set lang(value) {
        this.properties.currentLanguage = value;
        this.eventService.LANGUAGE_CHANGED.emit(value);
    }

    public get service() {
        return this._service;
    }

    public async run(): Promise<void> {
        this.pluginManager.run();
        if (this.properties.config.mode === "development") {
            this.properties.scopes = await this.service.getScopes();
            this.observer = container.resolve(Observer);
            await this.service.getTranslations(this.lang);
        }
        if (this.properties.config.watch) {
            this.observer.observe();
        }
        await this.refresh();
    }

    public async refresh() {
        return this.observer.handleSubtree(this.properties.config.targetElement);
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

    instant = (inputText: string, params: TranslationParams = {}, noWrap: boolean = false, orEmpty?: boolean): string => {
        if (this.properties.config.mode === 'development' && !noWrap) {
            return this.wrap(inputText, params);
        }
        return this.service.replaceParams(this.service.instant(inputText, null, orEmpty), params);
    };

    public stop = () => {
        this.observer && this.observer.stopObserving();
        this.pluginManager.stop()
    }

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