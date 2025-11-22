import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  private readonly products: Product[] = [];

  public findAll(): Product[] {
    return [...this.products];
  }

  public findOne(id: string): Product {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  public create(product: Product): Product {
    this.products.push(product);
    return product;
  }

  public update(id: string, product: Product): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index >= 0) {
      this.products[index] = product;
    }
    return product;
  }

  public delete(id: string): void {
    const index = this.products.findIndex((product) => product.id === id);
    if (index >= 0) {
      this.products.splice(index, 1);
    }
  }
}

