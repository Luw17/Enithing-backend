import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BulkUpdateStockDto } from './dto/bulk-update-stock.dto';
import { Product } from '../entities/product.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: any,
  ): Promise<Product> {
    console.log('Current User:', user);
    if (user.userId) {
      createProductDto.storeId = user.userId;
    }
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@CurrentUser() user: any): Promise<Product[]> {
    console.log('Current User:', user);
    return this.productService.findAll(user.userId);
  }

  @Patch('bulk-update-stock')
  bulkUpdateStock(@Body() bulkUpdateStockDto: BulkUpdateStockDto): Promise<void> {
    return this.productService.bulkUpdateStock(bulkUpdateStockDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}