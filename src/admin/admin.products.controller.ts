import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Redirect, Render, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from 'src/models/products/product.entity';
import { ProductsService } from '../models/products/products.service';
import * as fs from 'fs/promises';
import * as multer from 'multer';
import { ProductValidator } from 'src/validators/product.validator';


@Controller('/admin/products')
export class AdminProductsController {
    constructor(private readonly productsService: ProductsService) { }
    static get publicDir() {
        return './public/uploads';
    }
    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, AdminProductsController.publicDir);
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
    async store(@Body() body, @UploadedFile() image: Express.Multer.File, @Req() request) {
        const toValidate = ['name', 'description', 'price', 'imageCreated'];
        const errors = ProductValidator.validate(body, image, toValidate);
        if (errors.length > 0) {
            if (image) {
                await fs.unlink(image.path);
            }
            request.session.flashErrors = errors;
            return;
        }
        const newProduct = new Product();
        newProduct.name = body.name;
        newProduct.description = body.description;
        newProduct.price = body.price;
        newProduct.image = image.filename;
        await this.productsService.createOrUpdate(newProduct);
    }

    @Get('/:id')
    @Render('admin/products/edit')
    async edit(@Param('id') id: number) {
        const viewData = [];
        viewData['title'] = 'Admin Page - Edit Product - Online Store';
        viewData['product'] = await this.productsService.findOne(id);
        return {
            viewData: viewData,
        };
    }

    @Post('/:id/update')
    @UseInterceptors(FileInterceptor('image', { storage: AdminProductsController.storage }))
    @Redirect('/admin/products')
    async update(
        @Body() body,
        @UploadedFile() file: Express.Multer.File,
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Req() request,
        @Res() response
    ) {
        const toValidate: string[] = ['name', 'description', 'price', 'imageUpdate'];
        const errors: string[] = ProductValidator.validate(body, file, toValidate);
        if (errors.length > 0) {
            if (file) {
                await fs.unlink(file.path);
            }
            request.session.flashErrors = errors;
            return response.redirect('/admin/products/' + id);
        }
        const product = await this.productsService.findOne(id);
        product.name = body.name;
        product.description = body.description;
        product.price = body.price;
        if (file) {
            await fs.unlink(AdminProductsController.publicDir + '/' + product.image);
            product.image = file.filename;
        }
        await this.productsService.createOrUpdate(product);
        return response.redirect('/admin/products/');
    }

    @Post('/:id')
    @Redirect('/admin/products')
    remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
        return this.productsService.remove(id);
    }
}