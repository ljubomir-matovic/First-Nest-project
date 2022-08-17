import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import 'dotenv/config';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';
import { Product } from './models/products/product.entity';
import { ProductsService } from './models/products/products.service';
import { User } from './models/users/user.entity';
import { UsersService } from './models/users/user.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
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
        TypeOrmModule.forFeature([Product, User]),
        ProductsModule,
        AdminModule,
        AuthModule,
        CartModule
    ],
    controllers: [AppController],
    providers: [ProductsService, UsersService],
    exports: [ProductsService, UsersService]
})
export class AppModule { }
