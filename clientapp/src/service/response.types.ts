export type FileResponse = {
    fullPath: string,
    source: boolean,
    translations: { [key: string]: string }
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
    data: FileResponse[]
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
}

enum RepositoryPermissionType {
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
    userFullName: string,
    type: RepositoryPermissionType
}

