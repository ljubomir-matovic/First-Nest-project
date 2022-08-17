import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../items/item.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    image: string;

    @Column()
    price: number;

    @OneToMany(() => Item, (item) => item.product)
    items: Item[];

    static sumPricesByQuantities(products: Product[], productsInSession): number {
        let total = 0;
        for (let i = 0; i < products.length; i++) {
            total =
                total + products[i].price * productsInSession[products[i].id];
        }
        return total;
    }
}
