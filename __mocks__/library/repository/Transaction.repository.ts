/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Transaction } from '../../../src/library/entity';

export class TransactionRepository {
    private mockList = [
        {
            id: '1',
            total: 100.0,
            transactionType: 'Compra',
            cart: {
                id: '1'
            }
        }
    ] as unknown as Transaction[];

    public async create(transaction: Transaction): Promise<Transaction> {
        return Promise.resolve(this.mockList[0]);
    }

    public async createTransaction(transaction: Transaction): Promise<Transaction> {
        return Promise.resolve(this.mockList[0]);
    }
}
