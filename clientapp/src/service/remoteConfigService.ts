import {singleton} from 'tsyringe';
import {RemoteConfigurationDTO} from './response.types';
import {ApiHttpService} from './apiHttpService';

@singleton()
export class remoteConfigService {
    constructor(private http: ApiHttpService) {
    }

    public async getConfiguration(): Promise<RemoteConfigurationDTO> {
        return await (await this.http.fetch(`public/configuration`)).json();
    }
}
