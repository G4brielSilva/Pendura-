import { BaseRepository } from '../../common/models/BaseRepository';
import { ShopCart, StoreItem } from '../entity';
import { CartItem } from '../entity/CartItem.entity';

export class CartItemRepository extends BaseRepository(CartItem) {
    /**
     * findByStoreId - Busca carrinho por id da loja
     * @param { ShopCart } cart
     * @param { StoreItem } storeItem
     * @param { number } quantity
     * @returns { Promise<CartItem | null> }
     */
    public async addItemToCart(cart: ShopCart, storeItem: StoreItem, quantity: number): Promise<CartItem | null> {
        const { cartItems } = cart;

        const cartItem = cartItems.find((item: CartItem) => item.storeItem.id === storeItem.id);

        // Verifica se tem estoque do item na loja
        if (!this.cartItemHasStock(storeItem, quantity)) throw new Error('Item out of stock');

        // Cria o item no carrinho caso não esteja já no carrinho
        if (!cartItem) return this.create({ shopCart: cart, storeItem, quantity });

        // Atualiza a quantidade caso já esteja no carrinho
        return this.update(cartItem.id, { quantity });
    }

    private cartItemHasStock(storeItem: StoreItem, quantity: number): boolean {
        return storeItem.quantity >= quantity;
    }
}
