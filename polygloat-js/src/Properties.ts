import {PolygloatConfig} from './PolygloatConfig';
import {singleton} from 'tsyringe';

@singleton()
export class Properties {
    config: PolygloatConfig = new PolygloatConfig();
    currentLanguage: string = 'en';
    defaultLanguage: string = 'en';
    mode: Mode = Mode.DEVELOP;
    scopes: Scope[] = [];
}

export type Scope = "translations.edit" | "translations.view" | "sources.edit";

export enum Mode {
    DEVELOP = 'develop',
    PRODUCTION = 'production',
}
