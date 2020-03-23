import {string} from "yup";

export interface EditApiKeyDTO {
    "id": number,
    "scopes": string[]
}

export interface ImportDto {
    "data": { [key: string]: string },
    "languageAbbreviation": string
}