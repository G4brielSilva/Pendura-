import { IsNull } from 'typeorm';
import { BaseRepository } from '../../common/models/BaseRepository';
import { ShopCart } from '../entity/ShopCart.entity';
import { StockRepository } from './Stock.repository';

export class CartRepository extends BaseRepository(ShopCart) {
    /**
     * findByStoreId - Busca carrinho por id da loja
     * @param { string } storeId
     * @returns { Promise<ShopCart | null> }
     */
    public async findByStoreId(storeId: string): Promise<ShopCart | null> {
        return this.repository.findOne({ where: { store: { id: storeId }, closedAt: IsNull() } });
    }

    /**
     * closeCart
     * @param { string } cartId
     * @returns { Promise<ShopCart> }
     */
    public async closeCart(cartId: string): Promise<ShopCart> {
        const cart = await this.findById(cartId);

        await Promise.all(
            (cart?.cartItems ?? []).map(async item => {
                await new StockRepository().transactionStockChange(item.storeItem.id, item.quantity);
            })
        );

        return this.update(cartId, { closedAt: new Date() });
    }
}
