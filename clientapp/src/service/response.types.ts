export type FileResponse = {
    fullPath: string,
    source: boolean,
    translations: { [key: string]: string }
}

export type LanguageResponseType = {
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
