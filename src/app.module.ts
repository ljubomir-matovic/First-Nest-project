import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import 'dotenv/config';
import { ProductsModule } from './products/products.module';
const env = process.env;
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
		ProductsModule
    ],
    controllers: [AppController],
})
export class AppModule {}
