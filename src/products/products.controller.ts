import { Controller, Get, Param, Render } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
    constructor(private productsService:ProductsService){}
    @Get('/')
    @Render('products/index')
    async index() {
        const viewData = [];
        viewData['title'] = 'Products - Online Store';
        viewData['subtitle'] = 'List of products';
        viewData['products'] = await this.productsService.findAll();
        return {
            viewData: viewData,
        };
    }
    @Get('/:id')
    @Render('products/show')
    async show(@Param() params) {
        try{
        const product = await this.productsService.findOne(params.id);
        if(!product)
            throw new Error("Empty");
        const viewData = [];
        viewData['title'] = product.name + ' - Online Store';
        viewData['subtitle'] = product.name + ' - Product Information';
        viewData['product'] = product;
        return {
            viewData: viewData,
        };
    }catch(e){
        return {viewData:{title:'Not exists',subtitle:'Not Existss',product:null}}
    }
        }
}
