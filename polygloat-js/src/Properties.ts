import {PolygloatConfig} from './PolygloatConfig';
import {singleton} from 'tsyringe';

@singleton()
export class Properties {
    config: PolygloatConfig = new PolygloatConfig();
    currentLanguage: string = this.config.defaultLanguage;
    scopes: Scope[] = [];
}

export type Scope = "translations.edit" | "translations.view" | "sources.edit";

export type Mode = 'development' | 'production';
