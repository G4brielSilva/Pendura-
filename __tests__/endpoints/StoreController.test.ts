import request from 'supertest';
import { App } from '../../src/config/App';
import { v1 } from '../../src/endpoints/v1';
import { StockRepository } from '../../src/library/repository';

// Repositories mock
jest.mock('../../src/library/repository/Store.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Store.repository');
});

jest.mock('../../src/library/repository/Stock.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Stock.repository');
});

jest.mock('../../src/library/repository/Cart.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Cart.repository');
});

jest.mock('../../src/library/repository/CartItem.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/CartItem.repository');
});

// Third-Party mock
jest.mock('../../src/third-party/Jwt', () => {
    return jest.requireActual('../../__mocks__/third-party/Jwt');
});

// Utils mock
jest.mock('../../src/utils/ActionLoger', () => {
    return jest.requireActual('../../__mocks__/utils/ActionLoger');
});

const app = new App({
    path: '/api',
    port: process.env.API_PORT as unknown as number,
    middlewares: [],
    controllers: [...v1]
}).app;

const USER_VALID_TOKEN = 'USER_VALID_TOKEN';
const ADMIN_VALID_TOKEN = 'ADMIN_VALID_TOKEN';

describe('StoreController', () => {
    describe('Store Endpoints', () => {
        describe('POST - createStore', () => {
            const URL = '/api/store';

            const validStoreCredentials = {
                name: 'valid_store_name',
                cnpj: '62781317000160'
            }

            it('should return 400 if an invalid name was provided', async () => {
                const response = await request(app).post(URL).send({
                    ...validStoreCredentials,
                    name: 'nm'
                }).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid cnpj was provided', async () => {
                const response = await request(app).post(URL).send({
                    ...validStoreCredentials,
                    cnpj: 'invalid_cnpj'
                }).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid email and password was provided', async () => {
                const response = await request(app).post(URL).send(validStoreCredentials).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('GET - listStores', () => {
            const URL = '/api/store';
            it('should return 200 if valid email and password was provided', async () => {
                const response = await request(app).get(URL).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('GET - listStore', () => {
            const URL = '/api/store';
            const validStoreId = '1';

            it('should return 401 if an invalid User is trying to get a Store data', async () => {
                const response = await request(app).get(`${URL}/${validStoreId}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).get(`${URL}/invalid_store_id`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid storeId was provided', async () => {
                const response = await request(app).get(`${URL}/${validStoreId}`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('PUT - updateStore', () => {
            const URL = '/api/store';

            const validStoreId = '1';

            const validStoreCredentials = {
                name: 'valid_store_name',
                cnpj: '62781317000160'
            }

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).put(`${URL}/invalid_store_id`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid name was provided', async () => {
                const response = await request(app).put(`${URL}/${validStoreId}`).send({
                    ...validStoreCredentials,
                    name: 'nm'
                }).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send();

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid cnpj was provided', async () => {
                const response = await request(app).put(`${URL}/${validStoreId}`).send({
                    ...validStoreCredentials,
                    cnpj: 'invalid_cnpj'
                }).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send();

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid storeId was provided', async () => {
                const response = await request(app).put(`${URL}/${validStoreId}`).send(validStoreCredentials).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('DELETE - softDeleteStore', () => {
            const URL = '/api/store';

            const validStoreId = '1';

            const validStoreCredentials = {
                name: 'valid_store_name',
                cnpj: '62781317000160'
            }

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).delete(`${URL}/invalid_store_id`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 204 if valid storeId was provided', async () => {
                const response = await request(app).delete(`${URL}/${validStoreId}`).send(validStoreCredentials).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(204);
            });
        });
    });

    describe('Store Stock Endpoints', () => {
        describe('GET - getStock', () => {
            const URL = '/api/store/1/stock';

            it('should return 401 if an invalid User is trying to get a Store Stock', async () => {
                const response = await request(app).get(URL).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).get('/api/store/invalid_store_id/stock').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid storeId was provided', async () => {
                const response = await request(app).get(URL).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('GET - getItemStock', () => {
            const URL = '/api/store/1/stock';
            const validStoreItemId = '1';

            it('should return 401 if an invalid User is trying to get a Store Stock', async () => {
                const response = await request(app).get(`${URL}/${validStoreItemId}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).get('/api/store/invalid_store_id/stock').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 401 if an User is trying to get a StoreItem from other Store', async () => {
                const response = await request(app).get(`${URL}/${2}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(401);
            });


            it('should return 400 if an invalid storeItemId was provided', async () => {
                jest.spyOn(StockRepository.prototype, 'findById').mockResolvedValueOnce(null);

                const response = await request(app).get(`${URL}/invalid_store_item_id`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid params was provided', async () => {
                const response = await request(app).get(`${URL}/${validStoreItemId}`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('PUT - updateStoreItem', () => {
            const URL = '/api/store/1/stock';
            const validStoreItemId = '1';

            const validStoreItemCredentials = {
                quantity: 10,
                value: 10.0
            }

            it('should return 401 if an invalid User is trying to update a Store Stock', async () => {
                const response = await request(app).put(`${URL}/${validStoreItemId}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`).send(validStoreItemCredentials);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).put('/api/store/invalid_store_id/stock/1').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send(validStoreItemCredentials);

                expect(response.status).toBe(400);
            });

            it('should return 401 if an User is trying to update a StoreItem from other Store', async () => {
                const response = await request(app).put(`${URL}/${2}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`).send(validStoreItemCredentials);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeItemId was provided', async () => {
                jest.spyOn(StockRepository.prototype, 'findById').mockResolvedValueOnce(null);

                const response = await request(app).put(`${URL}/invalid_store_item_id`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send(validStoreItemCredentials);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid quantity was provided', async () => {
                const response = await request(app).put(`${URL}/${validStoreItemId}`).send({
                    ...validStoreItemCredentials,
                    quantity: -10
                }).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send();

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid value was provided', async () => {
                const response = await request(app).put(`${URL}/${validStoreItemCredentials}`).send({
                    ...validStoreItemCredentials,
                    value: -1
                }).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send();

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid params was provided', async () => {
                const response = await request(app).put(`${URL}/${validStoreItemId}`).send(validStoreItemCredentials).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });

        });
    });

    describe('Store Cart Endpoints', () => {
        describe('POST - addOrUpdateQuantityItemToCart', () => {
            const URL = '/api/store/1/cart/1';

            const validStoreItemCredentials = {
                quantity: 10
            }

            it('should return 401 if an invalid User is trying to add a StoreItem to Cart', async () => {
                const response = await request(app).post(URL).set('Authorization', `Bearer ${USER_VALID_TOKEN}`).send(validStoreItemCredentials);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).post('/api/store/invalid_store_id/cart/1').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send(validStoreItemCredentials);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid storeItemId was provided', async () => {
                const response = await request(app).post('/api/store/1/cart/invalid_store_item_id').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send(validStoreItemCredentials);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid quantity was provided', async () => {
                const response = await request(app).post(URL).send({
                    ...validStoreItemCredentials,
                    quantity: -10
                }).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid quantity greater than stock item quantity was provided', async () => {
                const response = await request(app).post(URL).send({
                    ...validStoreItemCredentials,
                    quantity: 999999999
                }).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid params was provided', async () => {
                const response = await request(app).post(URL).send(validStoreItemCredentials).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('GET - getItemsFromCart', () => {
            const URL = '/api/store/1/cart';

            it('should return 401 if an invalid User is trying to add a StoreItem to Cart', async () => {
                const response = await request(app).get(URL).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).get('/api/store/invalid_store_id/cart').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 200 if valid params was provided', async () => {
                const response = await request(app).get(URL).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('GET - getItemFromCartByCartItemId', () => {
            const URL = '/api/store/1/cart/1';

            it('should return 401 if an invalid User is trying to add a StoreItem to Cart', async () => {
                const response = await request(app).get(URL).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).get('/api/store/invalid_store_id/cart').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid cartItemId was provided', async () => {
                const response = await request(app).post('/api/store/1/cart/invalid_cart_item_id').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });


            it('should return 200 if valid params was provided', async () => {
                const response = await request(app).get(URL).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(200);
            });
        });

        describe('DELETE - removeItemFromCart', () => {
            const URL = '/api/store/1/cart/1';

            it('should return 401 if an invalid User is trying to delete a item to a Cart', async () => {
                const response = await request(app).delete(URL).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

                expect(response.status).toBe(401);
            });

            it('should return 400 if an invalid storeId was provided', async () => {
                const response = await request(app).delete('/api/store/invalid_store_id/cart/1').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 400 if an invalid cartItemId was provided', async () => {
                const response = await request(app).delete('/api/store/1/cart/invalid_cart_item_id').set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(400);
            });

            it('should return 204 if valid params was provided', async () => {
                const response = await request(app).delete(URL).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

                expect(response.status).toBe(204);
            });
        })
    });
});
