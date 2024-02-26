import { RequestHandler } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { AuthenticationRepository } from '../../../library/repository';
import { Password } from '../../../utils/Password';

export class AuthenticationValidator extends BaseValidator {
    /**
     * login
     * @return { Array<RequestHandler> }
     */
    public static login(): Array<RequestHandler> {
        return AuthenticationValidator.validationList({
            email: {
                in: 'body',
                isEmail: true,
                errorMessage: 'Credentials are invalid',
                custom: {
                    options: async (email: string, { req }): Promise<void> => {
                        const authentication = await new AuthenticationRepository().findByEmail(email);

                        if (!authentication || authentication.user.deletedAt) return Promise.reject();

                        req.body.authentication = authentication;
                        return Promise.resolve();
                    },
                    errorMessage: 'Email is not registered'
                }
            },
            password: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 8, max: 32 },
                    errorMessage: 'Credentials are invalid'
                },
                matches: {
                    options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]*$/], // Senha com pelo menos 8 caracteres; um caracter especial; um caracter maiusculo; um caracter minusculo; um número
                    errorMessage:
                        'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
                },
                custom: {
                    options: async (password: string, { req }): Promise<void> => {
                        const { authentication } = req.body;

                        const { password: hashedPassword, salt } = authentication;
                        if (!authentication || !Password.verifyPassword(password, hashedPassword, salt as string)) return Promise.reject();

                        return Promise.resolve();
                    }
                },
                errorMessage: 'Credentials are invalid'
            }
        });
    }

    /**
     * forgotPassword
     * @return { Array<RequestHandler> }
     */
    public static forgotPassword(): Array<RequestHandler> {
        return AuthenticationValidator.validationList({
            email: {
                in: 'body',
                isEmail: true,
                custom: {
                    options: async (email: string): Promise<void> => {
                        const authentication = await new AuthenticationRepository().findByEmail(email);

                        if (!authentication || authentication.user.deletedAt) return Promise.reject();
                        return Promise.resolve();
                    },
                    errorMessage: 'Email is not registered'
                },
                errorMessage: 'Credentials are invalid'
            }
        });
    }

    /**
     * verifyRecoveryCode
     * @return { Array<RequestHandler> }
     */
    public static verifyRecoveryCode(): Array<RequestHandler> {
        return AuthenticationValidator.validationList({
            recoveryCode: {
                in: 'params',
                isString: true,
                isLength: { options: { min: 6, max: 6 } },
                custom: {
                    options: async (recoveryCode: string, { req }): Promise<void> => {
                        const isValid = await Password.recoveryCodeIsValid(req.body.email, recoveryCode);

                        return isValid ? Promise.resolve() : Promise.reject();
                    }
                },
                errorMessage: 'invalid recoveryCode'
            }
        });
    }

    /**
     * changePassword
     * @return { Array<RequestHandler> }
     */
    public static changePassword(): Array<RequestHandler> {
        return AuthenticationValidator.validationList({
            email: {
                in: 'body',
                isEmail: true,
                custom: {
                    options: async (email: string, { req }): Promise<void> => {
                        const authentication = await new AuthenticationRepository().findByEmail(email);

                        if (!authentication || authentication.user.deletedAt) return Promise.reject();

                        req.body.authentication = authentication;
                        return Promise.resolve();
                    },
                    errorMessage: 'Email is not registered'
                },
                errorMessage: 'Credentials are invalid'
            },
            recoveryCode: {
                in: 'body',
                isString: true,
                isLength: { options: { min: 6, max: 6 } },
                custom: {
                    options: async (recoveryCode: string, { req }): Promise<void> => {
                        const isValid = await Password.recoveryCodeIsValid(req.body.email, recoveryCode);

                        return isValid ? Promise.resolve() : Promise.reject();
                    }
                },
                errorMessage: 'invalid recoveryCode'
            },
            newPassword: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 8, max: 32 },
                    errorMessage: 'Credentials are invalid'
                },
                matches: {
                    options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]*$/], // Senha com pelo menos 8 caracteres; um caracter especial; um caracter maiusculo; um caracter minusculo; um número
                    errorMessage:
                        'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
                },
                errorMessage: 'Credentials are invalid'
            }
        });
    }

    /**
     * register
     * @return { Array<RequestHandler> }
     */
    public static register(): Array<RequestHandler> {
        return AuthenticationValidator.validationList({
            email: {
                in: 'body',
                isEmail: true,
                errorMessage: 'Credentials are invalid',
                custom: {
                    options: async (email: string): Promise<void> => {
                        const authentication = await new AuthenticationRepository().findByEmail(email);

                        if (authentication) return Promise.reject();
                        return Promise.resolve();
                    },
                    errorMessage: 'Email already registered'
                }
            },
            password: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 8, max: 32 },
                    errorMessage: 'Credentials are invalid'
                },
                matches: {
                    options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]*$/], // Senha com pelo menos 8 caracteres; um caracter especial; um caracter maiusculo; um caracter minusculo; um número
                    errorMessage:
                        'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
                },
                errorMessage: 'Credentials are invalid'
            },
            passwordConfirmation: {
                in: 'body',
                isString: true,
                custom: {
                    options: (value, { req }) => value === req.body.password,
                    errorMessage: 'confirmationPassword and password must be equals'
                },
                errorMessage: 'passwordConfirmation is invalid'
            },
            name: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 3, max: 254 },
                    errorMessage: 'name must be at least 3 characters long'
                },
                errorMessage: 'name is invalid'
            }
        });
    }
}
