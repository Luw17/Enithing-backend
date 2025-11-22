import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { SaleService } from './sale.service';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Body() createSaleDto: any): any {
    return this.saleService.create(createSaleDto);
  }
  
  @Get()
  findAll(): any[] {
    return this.saleService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): any {
    return this.saleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSaleDto: any): any {
    return this.saleService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): any {
    return this.saleService.remove(id);
  }
}
