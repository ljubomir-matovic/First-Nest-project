import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { ProductsService } from './product.service';
import { ProductsController } from './products.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Product]),],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
