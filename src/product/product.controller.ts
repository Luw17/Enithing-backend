import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async findAll(): Promise<any> {
        return this.productService.findAll();
    }

    @Post()
    async create(@Body() product: any): Promise<any> {
        return this.productService.create(product);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.productService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() product: any): Promise<any> {
        return this.productService.update(id, product);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return this.productService.delete(id);
    }

}

