/* eslint-disable @typescript-eslint/no-unused-vars */
import { StoreItem } from '../../../src/library/entity';

export class StockRepository {
    private mockStockList = [
        {
            id: '1',
            quantity: 10,
            value: 10.0,
            store: {
                id: '1'
            },
            product: {
                id: '1'
            }
        },
        {
            id: '2',
            quantity: 20,
            value: 20.0,
            store: {
                id: '2'
            },
            product: {
                id: '2'
            }
        }
    ] as unknown as StoreItem[];

    public async getStoreStock(storeId: string): Promise<StoreItem[]> {
        return this.mockStockList;
    }

    public async findById(storeItemId: string): Promise<StoreItem | null> {
        return this.mockStockList.find(stock => stock.id === storeItemId) as StoreItem;
    }

    public async create(storeItemId: string): Promise<StoreItem | null> {
        return this.mockStockList[0];
    }

    public async update(storeItemId: string): Promise<StoreItem | null> {
        return this.mockStockList[0];
    }
}
