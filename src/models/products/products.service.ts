import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }
    findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }
    findOne(id: number): Promise<Product> {
        return this.productsRepository.findOne({ where: { id: id } })
    }
    createOrUpdate(newProduct: Product) {
        return this.productsRepository.save(newProduct);
    }
    async remove(id: number) {
        await this.productsRepository.delete(id);
    }
    async findByIds(ids: string[]): Promise<Product[]> {
        return this.productsRepository.findBy({ id: In([...ids]) });
    }
}
