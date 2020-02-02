import {singleton} from 'tsyringe';
import {ApiHttpService} from './apiHttpService';
import {CONFIG} from '../config';
import {ErrorResponseDTO, TokenDTO, UserDTO} from './response.types';
import {tokenService} from './tokenService';
import {API_LINKS} from '../constants/apiLinks';
import {LINKS} from '../constants/links';
import {messageService} from './messageService';
import {RedirectionActions} from '../store/global/redirectionActions';


@singleton()
export class userService {
    constructor(private http: ApiHttpService) {
    }

    public getUserData = (): Promise<UserDTO> => this.http.get("user");
}
