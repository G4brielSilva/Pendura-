import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EnumTransactions } from '../../common/models/enum/EnumTransactions';
import { ShopCart } from './ShopCart.entity';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    payedAt: Date;

    @OneToOne(() => ShopCart)
    @JoinColumn()
    cart: ShopCart;

    @Column({ type: 'enum', enum: EnumTransactions })
    transactionType: EnumTransactions;
}
