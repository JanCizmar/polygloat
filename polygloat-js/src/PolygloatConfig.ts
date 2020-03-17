export class PolygloatConfig {
    tagAttributes?: { [key: string]: string[] } = {
        'textarea': ['placeholder'],
        'input': ['value', 'placeholder']
    };
    defaultLanguage?: string = 'en';
    inputPrefix?: string = '%-%polygloat:';
    inputPostfix?: string = '%-%';
    apiUrl: string;
    apiKey: string;
}
