import { DeepPartial } from 'typeorm';
import { BaseRepository } from '../../common/models/BaseRepository';
import { EnumTransactions } from '../../common/models/enum/EnumTransactions';
import { CartItem, Transaction } from '../entity';

export class TransactionRepository extends BaseRepository(Transaction) {
    /**
     * createTransaction
     *
     * Cria uma transação no banco
     *
     * @param { DeepPartial<Transaction> } transaction
     * @returns { Promise<Transaction> }
     */
    public async createTransaction(transaction: DeepPartial<Transaction>): Promise<Transaction> {
        const cartItems = transaction?.cart?.cartItems as CartItem[];
        const total = cartItems.reduce((acc, item) => acc + item.storeItem.value * item.quantity, 0);

        const isCompra = transaction.transactionType === EnumTransactions.COMPRA;

        return this.create({
            ...transaction,
            total,
            payedAt: isCompra ? new Date() : undefined
        });
    }
}
