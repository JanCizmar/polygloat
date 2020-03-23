import {container, singleton} from 'tsyringe';

import {repositoryService} from '../../service/repositoryService';
import {RepositoryDTO} from '../../service/response.types';
import {LINKS} from "../../constants/links";
import {AbstractLoadableActions, StateWithLoadables} from "../AbstractLoadableActions";
import {importExportService} from "../../service/importExportService";

export class ImportExportState extends StateWithLoadables<ImportExportActions> {

}

@singleton()
export class ImportExportActions extends AbstractLoadableActions<ImportExportState> {
    constructor() {
        super(new ImportExportState());
    }

    private service = container.resolve(importExportService);

    loadableDefinitions = {
        import: this.createLoadableDefinition(this.service.doImport)
    };

    get prefix(): string {
        return 'IMPORT_EXPORT';
    }

}
