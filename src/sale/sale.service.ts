import { Injectable, NotFoundException } from '@nestjs/common';

interface Sale {
  id: number;
  product?: string;
  amount?: number;
  [key: string]: any;
}

@Injectable()
export class SaleService {
  private sales: Sale[] = [];
  private idCounter = 1;

  create(createSaleDto: any) {
    const sale: Sale = { id: this.idCounter++, ...createSaleDto };
    this.sales.push(sale);
    return sale;
  }

  findAll() {
    return this.sales;
  }

  findOne(id: number) {
    const sale = this.sales.find((s) => s.id === id);
    if (!sale) throw new NotFoundException(`Sale #${id} not found`);
    return sale;
  }

  update(id: number, updateSaleDto: any) {
    const index = this.sales.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException(`Sale #${id} not found`);
    this.sales[index] = { ...this.sales[index], ...updateSaleDto };
    return this.sales[index];
  }

  remove(id: number) {
    const index = this.sales.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException(`Sale #${id} not found`);
    const [removed] = this.sales.splice(index, 1);
    return { deleted: true, sale: removed };
  }
}
