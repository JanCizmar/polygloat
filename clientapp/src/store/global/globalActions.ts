import {SecurityDTO} from './types';
import {singleton} from 'tsyringe';
import {remoteConfigService} from '../../service/remoteConfigService';
import {securityService} from '../../service/securityService';
import {ErrorResponseDTO, RemoteConfigurationDTO, TokenDTO, UserDTO} from '../../service/response.types';
import {userService} from "../../service/userService";
import {ConfirmationDialogProps} from "../../component/common/ConfirmationDialog";
import {AbstractLoadableActions, createLoadable, StateWithLoadables} from "../AbstractLoadableActions";

export class GlobalState extends StateWithLoadables<GlobalActions> {
    authLoading: boolean = false;
    security: SecurityDTO = {
        allowPrivate: !!localStorage.getItem('jwtToken'),
        jwtToken: localStorage.getItem('jwtToken') || null,
        loginErrorCode: null
    };
    passwordResetLoading = false;
    passwordResetSent = false;
    passwordResetError: string = null;
    passwordResetSetLoading = false;
    passwordResetSetValidated = false;
    passwordResetSetError = null;
    passwordResetSetSucceed = false;
    confirmationDialog: ConfirmationDialogProps = null;
}


@singleton()
export class GlobalActions extends AbstractLoadableActions<GlobalState> {
    constructor(private configService: remoteConfigService, private securityService: securityService, private userService: userService) {
        super(new GlobalState());
    }

    oAuthSuccessful = this.buildLoginAction('AUTHORIZE_OAUTH',
        (serviceType, code) => this.securityService.authorizeOAuthLogin(serviceType, code));


    logout = this.createAction('LOGOUT', () => this.securityService.logout()).build.on(
        (state, action) => (
            {...state, security: <SecurityDTO>{...state.security, jwtToken: null, allowPrivate: false}}
        ));
    login = this.buildLoginAction('LOGIN', v => this.securityService.login(v));
    resetPasswordRequest = this.createPromiseAction('PASSWORD_RESET_REQUEST',
        (email) => this.securityService.resetPasswordRequest(email))
        .build.onPending((state, action) => {
            return <GlobalState>{...state, passwordResetLoading: true, passwordResetSent: false, passwordResetError: null};
        }).build.onFullFilled((state, action) => {
            return <GlobalState>{...state, passwordResetSent: true, passwordResetLoading: false, passwordResetError: null};
        }).build.onRejected((state, action) => {
            return <GlobalState>{
                ...state,
                passwordResetSent: false,
                passwordResetLoading: false,
                passwordResetError: action.payload.code
            };
        });
    resetPasswordValidate = this.createPromiseAction<never, ErrorResponseDTO>('RESET_PASSWORD_VALIDATE',
        this.securityService.resetPasswordValidate)
        .build.onPending((state, action) => {
            return {...state, passwordResetSetLoading: true};
        }).build.onFullFilled((state, action) => {
            return {...state, passwordResetSetLoading: false, passwordResetSetValidated: true};
        }).build.onRejected((state, action) => {
            return <GlobalState>{
                ...state,
                passwordResetSetValidated: false,
                passwordResetSetError: action.payload.code,
                passwordResetSetLoading: false
            };
        });
    resetPasswordSet = this.createPromiseAction<void, ErrorResponseDTO>('RESET_PASSWORD_SET',
        this.securityService.resetPasswordSet)
        .build.onPending((state, action) => {
            return <GlobalState>{...state, passwordResetSetLoading: true, passwordResetSetSucceed: false};
        }).build.onFullFilled((state, action) => {
            return <GlobalState>{...state, passwordResetSetSucceed: true};
        }).build.onRejected((state, action) => {
            return <GlobalState>{
                ...state, passwordResetSetError: action.payload.code,
                passwordResetSetSucceed: false,
                passwordResetSetLoading: false
            };
        });

    setJWTToken = this.createAction('SET_JWT', token => token).build.on(
        (state, action) => {
            return {
                ...state,
                security: {...state.security, allowPrivate: true, jwtToken: action.payload.accessToken, loginErrorCode: null}
            };
        });


    openConfirmation = this.createAction('OPEN_CONFIRMATION',
        (options: ConfirmationDialogProps) => (options))
        .build.on((state, action) =>
            (<GlobalState>{
                ...state,
                confirmationDialog: action.payload
            }));

    closeConfirmation = this.createAction('CLOSE_CONFIRMATION', null)
        .build.on((state, action) =>
            (<GlobalState>{
                ...state,
                confirmationDialog: null
            }));

    get loadableDefinitions() {
        return {
            userData: this.createLoadableDefinition<UserDTO>(this.userService.getUserData),
            remoteConfig: this.createLoadableDefinition<RemoteConfigurationDTO>(() => this.configService.getConfiguration())
        }
    };

    get prefix(): string {
        return 'GLOBAL';
    }

    private buildLoginAction(name: string, payloadProvider: (...params) => Promise<TokenDTO>) {
        return this.createPromiseAction<TokenDTO, ErrorResponseDTO>(name, payloadProvider)
            .build.onPending((state, action) => (
                {...state, authLoading: true}
            ))
            .build.onFullFilled((state, action) => (
                <GlobalState>{
                    ...state,
                    authLoading: false,
                    security: {...state.security, allowPrivate: true, jwtToken: action.payload.accessToken, loginErrorCode: null}
                }
            )).build.onRejected((state, action) => ({
                ...state,
                authLoading: false,
                security: <SecurityDTO>{loginErrorCode: action.payload.code}
            }));
    }
}
