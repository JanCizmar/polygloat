import * as Yup from 'yup';
import {container} from "tsyringe";
import {signUpService} from "../service/signUpService";

export class Validation {

    static readonly USER_PASSWORD = Yup.string().min(8).max(100).required();

    static readonly USER_PASSWORD_WITH_REPEAT_NAKED = {
        password: Validation.USER_PASSWORD,
        passwordRepeat: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required()
    };

    static readonly USER_PASSWORD_WITH_REPEAT = Yup.object().shape(Validation.USER_PASSWORD_WITH_REPEAT_NAKED);

    static readonly RESET_PASSWORD_REQUEST = Yup.object().shape({
        email: Yup.string().email().required()
    });

    private static readonly createEmailValidation = (): (v) => Promise<boolean> => {
        let timer = null;
        const signUpServiceImpl = container.resolve(signUpService);
        let lastValue = undefined;
        let lastResult = undefined;
        return (v) => {
            clearTimeout(timer);
            return new Promise((resolve) => {
                timer = setTimeout(
                    () => {
                        if (lastValue == v) {
                            resolve(lastResult);
                            return;
                        }
                        lastResult = v && Yup.string().email().validateSync(v) && signUpServiceImpl.validateEmail(v);
                        resolve(lastResult);
                        lastValue = v;
                    },
                    500,
                );
            });
        }
    };

    static readonly SIGN_UP = Yup.object().shape({
        ...Validation.USER_PASSWORD_WITH_REPEAT_NAKED,
        name: Yup.string().required(),
        email: Yup.string().email().required()
            .test('checkEmailUnique', 'User with this e-mail already exists.', Validation.createEmailValidation())
    });

    static readonly API_KEY_SCOPES = Yup.mixed().test(
        "is-set",
        'Set at least one scope',
        v => !!(v as Set<string>).size
    );

    static readonly EDIT_API_KEY = Yup.object().shape({
        scopes: Validation.API_KEY_SCOPES
    });

    static readonly CREATE_API_KEY = Yup.object().shape({
        repositoryId: Yup.number().required(),
        scopes: Yup.mixed().test(
            "is-set",
            'Set at least one scope',
            v => !!(v as Set<string>).size
        )
    });

    static readonly TRANSLATION_SOURCE = Yup.string().required();

    static readonly TRANSLATION_TRANSLATION = Yup.string();

    static readonly LANGUAGE_NAME = Yup.string().required().max(100);

    static readonly LANGUAGE_ABBREVIATION = Yup.string().required().max(20);

    static readonly LANGUAGE = Yup.object().shape(
        {
            name: Validation.LANGUAGE_NAME,
            abbreviation: Validation.LANGUAGE_ABBREVIATION
        });

    static readonly SOURCE_TRANSLATION_CREATION = (langs: string[]) => {
        let translationValidation = langs.reduce((validation, lang) =>
            ({...validation, ["translations." + lang]: Validation.TRANSLATION_TRANSLATION}), {});
        return Yup.object().shape({source: Validation.TRANSLATION_SOURCE, ...translationValidation});
    };

    static readonly REPOSITORY_CREATION = Yup.object().shape(
        {
            name: Yup.string().required().min(3).max(500),
            languages: Yup.array().required().of(Yup.object().shape({
                name: Validation.LANGUAGE_NAME.label("name").required("This field is required"),
                abbreviation: Validation.LANGUAGE_ABBREVIATION.label("name").required("This field is required")
            }))
        });


}