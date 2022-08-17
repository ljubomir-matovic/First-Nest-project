import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne,
    OneToMany, CreateDateColumn
} from 'typeorm';
import { Item } from '../items/item.entity';
import { User } from '../users/user.entity';

@Entity({ name: "orders" })
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total: number;

    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => Item, (item) => item.order)
    items: Item[];
}