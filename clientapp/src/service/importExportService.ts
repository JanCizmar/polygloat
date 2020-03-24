import {container, singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {messageService} from './messageService';
import {ImportDto} from "./request.types";

const http = container.resolve(ApiHttpService);

@singleton()
export class importExportService {
    constructor(private messaging: messageService) {
    }

    readonly doImport = async (repositoryId: number, dto: ImportDto) => {
        await http.post("repository/" + repositoryId + "/import", dto);
        this.messaging.success("Successfully imported!");
    };

    readonly exportToJsons = async (repositoryId: number) => http.getFile("repository/" + repositoryId + "/export/jsonZip");

}
