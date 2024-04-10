import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopCart } from './ShopCart.entity';
import { StoreItem } from './StoreItem.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', unsigned: true })
    quantity: number;

    @ManyToOne(() => StoreItem, { eager: true })
    @JoinColumn()
    storeItem: StoreItem;

    @ManyToOne(() => ShopCart)
    @JoinColumn()
    shopCart: ShopCart;
}
