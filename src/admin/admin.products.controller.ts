import { Body, Controller, Get, Post, Redirect, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from 'src/models/products/product.entity';
import { ProductsService } from '../models/products/products.service';
import * as multer from 'multer';
@Controller('/admin/products')
export class AdminProductsController {
    constructor(private readonly productsService: ProductsService) { }
    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/uploads');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    });
    @Get('/')
    @Render('admin/products/index')
    async index() {
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Online Store';
        viewData['products'] = await this.productsService.findAll();
        return {
            viewData: viewData,
        };
    }
    @Post('/store')
    @UseInterceptors(FileInterceptor('image', { storage: AdminProductsController.storage }))
    @Redirect('/admin/products')
    async store(@Body() body, @UploadedFile() image: Express.Multer.File) {
        const newProduct = new Product();
        newProduct.name = body.name;
        newProduct.description = body.description;
        newProduct.price = body.price;
        newProduct.image = image.filename;
        await this.productsService.createOrUpdate(newProduct);
    }
}