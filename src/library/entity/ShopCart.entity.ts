import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from './CartItem.entity';
import { Store } from './Store.entity';

@Entity('shop_carts')
export class ShopCart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'datetime', default: null })
    closedAt: Date;

    @OneToMany(() => CartItem, cartItem => cartItem.shopCart, { eager: true })
    @JoinColumn()
    cartItems: CartItem[];

    @ManyToOne(() => Store)
    @JoinColumn()
    store: Store;
}
