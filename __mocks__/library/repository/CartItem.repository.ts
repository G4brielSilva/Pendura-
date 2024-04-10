/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CartItem, ShopCart, StoreItem } from '../../../src/library/entity';

export class CartItemRepository {
    private mockList = [
        {
            id: '1',
            quantity: 10,
            storeItem: {
                id: '1',
                store: {
                    id: '1'
                }
            },
            shopCart: {
                id: '1'
            }
        }
    ] as unknown as CartItem[];

    public async addItemToCart(cart: ShopCart, storeItem: StoreItem, quantity: number): Promise<CartItem> {
        if (quantity > this.mockList[0].quantity) throw Error('Item out of stock');
        return Promise.resolve(this.mockList[0]);
    }

    public async delete(cart: ShopCart, storeItem: StoreItem, quantity: number): Promise<CartItem> {
        return Promise.resolve(this.mockList[0]);
    }

    public async findById(cartItemId: string): Promise<CartItem | null> {
        return Promise.resolve(this.mockList.find(cartItem => cartItem.id === cartItemId) as CartItem);
    }
}
