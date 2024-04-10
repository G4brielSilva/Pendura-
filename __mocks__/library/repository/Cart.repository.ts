/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ShopCart } from '../../../src/library/entity';

export class CartRepository {
    private mockList = [
        {
            id: '1',
            closedAt: null,
            cartItems: [
                {
                    id: '1',
                    storeItem: {
                        id: '1',
                        store: {
                            id: '1'
                        }
                    }
                }
            ],
            store: {
                id: '1'
            }
        }
    ] as unknown as ShopCart[];

    public async create(shopCart: ShopCart): Promise<ShopCart> {
        return Promise.resolve(this.mockList[0]);
    }

    public async findByStoreId(storeId: string): Promise<ShopCart> {
        return Promise.resolve(this.mockList.find(shopcart => shopcart.store.id === storeId) as ShopCart);
    }

    public async findById(shopcartId: string): Promise<ShopCart | null> {
        return Promise.resolve(this.mockList.find(shopcart => shopcart.id === shopcartId) as ShopCart);
    }

    public async closeCart(cartId: string): Promise<ShopCart> {
        return Promise.resolve(this.mockList[0]);
    }
}
