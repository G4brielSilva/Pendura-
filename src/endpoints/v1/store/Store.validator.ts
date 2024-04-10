/* eslint-disable no-plusplus */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { CartItemRepository, CartRepository, StockRepository, StoreRepository } from '../../../library/repository';

export class StoreValidator extends BaseValidator {
    /**
     * storeData - Valida dados da loja (name & cnpj)
     * @return { Array<RequestHandler> }
     */
    public static storeData(): Array<RequestHandler> {
        return StoreValidator.validationList({
            name: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 3, max: 254 },
                    errorMessage: 'name must be at least 3 characters long'
                },
                errorMessage: 'name is invalid'
            },
            cnpj: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 14, max: 14 },
                    errorMessage: 'cnpj must be at least 14 characters long'
                },
                custom: {
                    options: async (cnpj: string): Promise<void> => {
                        const digits = new Set(cnpj);
                        if (digits.size === 1) return Promise.reject();

                        let size = cnpj.length - 2;
                        let numbers = cnpj.substring(0, size);
                        const verifiersDigits = cnpj.substring(size);

                        let sum = 0;
                        let pos = size - 7;

                        for (let i = size; i >= 1; i--) {
                            sum += Number(numbers.charAt(size - i)) * pos--;
                            if (pos < 2) pos = 9;
                        }
                        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
                        if (result !== Number(verifiersDigits.charAt(0))) return Promise.reject();

                        size += 1;
                        numbers = cnpj.substring(0, size);
                        sum = 0;
                        pos = size - 7;

                        for (let i = size; i >= 1; i--) {
                            sum += Number(numbers.charAt(size - i)) * pos--;
                            if (pos < 2) pos = 9;
                        }
                        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
                        if (result !== Number(verifiersDigits.charAt(1))) return Promise.reject();

                        // Verifing if cnpj already exists in the system

                        const store = await new StoreRepository().findStoreByCnpj(cnpj);

                        // eslint-disable-next-line prefer-promise-reject-errors
                        if (store) return Promise.reject('cnpj already registered in the system');

                        return Promise.resolve();
                    }
                },
                errorMessage: 'cnpj is invalid'
            }
        });
    }

    /**
     * onlyId - Verifica se o id passado no path é válido e corresponde ao usuário autenticado
     */
    public static async onlyId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { storeId } = req.params;

        const store = await new StoreRepository().findById(storeId);
        if (!store) return RouteResponse.badRequest(res, 'invalid StoreId');

        const { role, userId } = req.body.authentication;

        if (store?.owner.id !== userId && role !== EnumRoles.ADMIN) return RouteResponse.unauthorized(res);

        req.body.storeId = storeId;
        return next();
    }

    /**
     * storeItemId - Verifica se o id de storeItem passado no path é válido e corresponde a Store recebida
     */
    public static async storeItemId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { storeItemId } = req.params;

        const storeItem = await new StockRepository().findById(storeItemId);

        if (!storeItem || !!storeItem.store.deletedAt) return RouteResponse.badRequest(res, 'invalid StoreItemId');

        const { storeId } = req.body;

        if (storeItem.store.id !== storeId) return RouteResponse.unauthorized(res);

        req.body.storeItemId = storeItemId;
        return next();
    }

    /**
     * storeItemData - Atualiza o valor de storeItem
     * @return { Array<RequestHandler> }
     */
    public static storeItemData(): Array<RequestHandler> {
        return StoreValidator.validationList({
            quantity: {
                in: 'body',
                isNumeric: true,
                custom: {
                    options: async (value: number): Promise<void> => {
                        if (value < 0) return Promise.reject();
                        return Promise.resolve();
                    },
                    errorMessage: 'quantity must be a positive number'
                },
                errorMessage: 'quantity is invalid'
            },
            value: {
                in: 'body',
                isNumeric: true,
                custom: {
                    options: async (value: number): Promise<void> => {
                        if (value < 0) return Promise.reject();
                        return Promise.resolve();
                    },
                    errorMessage: 'value must be a positive number'
                },
                errorMessage: 'value is invalid'
            }
        });
    }

    /**
     * hasCart - Verifica se tem um carrinho vinculado a loja do usuário
     * @return { Array<RequestHandler> }
     */
    public static async hasCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { storeId } = req.body;

        const cartRepository = new CartRepository();

        let cart = await cartRepository.findByStoreId(storeId);

        if (!cart) {
            cart = await cartRepository.create({ store: { id: storeId } });
        }

        req.body.cartId = cart.id;

        return next();
    }

    public static storeItemQuantity(): Array<RequestHandler> {
        return StoreValidator.validationList({
            quantity: {
                in: 'body',
                isNumeric: true,
                custom: {
                    options: async (value: number): Promise<void> => {
                        if (value < 0) return Promise.reject();
                        return Promise.resolve();
                    },
                    errorMessage: 'quantity must be a positive number'
                },
                errorMessage: 'quantity is invalid'
            }
        });
    }

    public static cartItemId(): Array<RequestHandler> {
        return StoreValidator.validationList({
            cartItemId: {
                in: 'params',
                isString: true,
                custom: {
                    options: async (cartItemId: string, { req }): Promise<void> => {
                        const cartItem = await new CartItemRepository().findById(cartItemId);

                        if (!cartItem) return Promise.reject();
                        if (cartItem.storeItem.store.id !== req.body.storeId) return Promise.reject();

                        req.body.cartItemId = cartItemId;

                        return Promise.resolve();
                    }
                },
                errorMessage: 'invalid CartItemId'
            }
        });
    }
}
