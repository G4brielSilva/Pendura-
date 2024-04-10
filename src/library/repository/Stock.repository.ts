import { FindManyOptions } from 'typeorm';
import { IListParams } from '../../common/models/BaseController';
import { BaseRepository } from '../../common/models/BaseRepository';
import { StoreItem } from '../entity';

export class StockRepository extends BaseRepository(StoreItem) {
    /**
     * getStoreStock - Listar os items no estoque da loja
     *
     * @param { string } storeId
     * @returns { Promise<void> }
     */
    public async getStoreStock(storeId: string, params: IListParams): Promise<StoreItem[]> {
        const skip = params.size * (params.page - 1);
        const take = params.size;

        const options: FindManyOptions<StoreItem> = { take, skip, where: { store: { id: storeId } } };

        if (params.order) {
            options.order = { [params.order]: params.orderBy };
        }

        return this.repository.find(options);
    }

    /**
     * changeStoreItemStock - Alterar quantidade de itens no estoque
     * @param { string } storeItemId
     * @param { number } quantity
     * @returns { Promise<StoreItem> }
     */
    public async changeStoreItemStock(storeItemId: string, quantity: number): Promise<StoreItem> {
        return this.update(storeItemId, { quantity });
    }

    /**
     * transactionStockChange - Subtração de Estoque de Item de Loja após venda
     * @param { string } storeItemId
     * @param { number } quantity
     * @returns { Promise<StoreItem> }
     */
    public async transactionStockChange(storeItemId: string, quantity: number): Promise<StoreItem> {
        const storeItem = (await this.findById(storeItemId)) as StoreItem;
        const newStockQuantity = storeItem.quantity - quantity;

        return this.changeStoreItemStock(storeItemId, newStockQuantity);
    }
}
