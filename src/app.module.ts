import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import 'dotenv/config';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';
import { Product } from './models/products/product.entity';
import { ProductsService } from './models/products/products.service';
const env = process.env;
@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: env.DB_HOST,
            username: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            port: Number(env.DB_PORT),
            database: env.DB_NAME,
            entities: ['dist/**/*.entity.js'],
        }),
        TypeOrmModule.forFeature([Product]),
		ProductsModule,
        AdminModule
    ],
    controllers: [AppController],
    providers:[ProductsService],
    exports:[ProductsService]
})
export class AppModule {}
