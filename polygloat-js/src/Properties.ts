import {PolygloatConfig} from './PolygloatConfig';
import {singleton} from 'tsyringe';

@singleton()
export class Properties {
    config: PolygloatConfig = new PolygloatConfig();
    currentLanguage: string = 'en';
    defaultLanguage: string = 'en';
    mode: Mode = Mode.DEVELOP;
}

export enum Mode {
    DEVELOP = 'develop',
    PRODUCTION = 'production',
}
