export type TranslationsObject = { [abbreviation: string]: string };

export type SourceTranslationsDTO = {
    name: string,
    translations: TranslationsObject
}

export type LanguageDTO = {
    abbreviation: string,
    id: number,
    name: string
}
export type TranslationsDataResponse = {
    paginationMeta: {
        offset: number,
        allCount: number
    },
    params: {
        search: string,
        languages: string[],
    }
    data: SourceTranslationsDTO[]
}

export type RepositoryDTO = {
    id: number,
    name: string,
    permissionType: RepositoryPermissionType
}

export interface RemoteConfigurationDTO {
    authentication: boolean;
    passwordResettable: boolean;
    allowRegistrations: boolean;
    authMethods: {
        github: {
            enabled: boolean;
            clientId: string;
        }
    }
}

export interface TokenDTO {
    accessToken: string,
}

export type ErrorResponseDTO = {
    code: string;
    params: [];
    __handled: boolean;
}

export enum RepositoryPermissionType {
    MANAGE = 'MANAGE',
    EDIT = 'EDIT',
    TRANSLATE = 'TRANSLATE',
    VIEW = 'VIEW'
}

export interface InvitationDTO {
    id: number,
    code: string,
    type: RepositoryPermissionType
}

export interface PermissionDTO {
    id: number,
    username: string,
    userId: number,
    userFullName: string,
    type: RepositoryPermissionType
}

export interface UserDTO {
    id: number,
    username: string,
    name: string,
}

export interface ApiKeyDTO {
    "id": number,
    "key": string,
    "userName": string,
    "scopes": string[],
    "repositoryId": number,
    "repositoryName": string,
}

