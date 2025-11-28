import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from '../entities/sale.entity';
import { SaleItem } from '../entities/sale-item.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productIds = createSaleDto.items.map((item) => item.productId);
      const products = await this.productRepository.find({
        where: { id: In(productIds) },
      });
      if (products.length !== productIds.length) {
        throw new NotFoundException('Um ou mais produtos não foram encontrados no banco de dados.');
      }

      let totalAmount = 0;
      const saleItemsToSave: SaleItem[] = [];

      for (const itemDto of createSaleDto.items) {
        const product = products.find((p) => p.id === itemDto.productId);

        if (!product) {
            throw new NotFoundException(`Produto com ID #${itemDto.productId} não encontrado.`);
        }

        if (product.stockQuantity < itemDto.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto: ${product.name}. Disponível: ${product.stockQuantity}`,
          );
        }

        const unitPrice = itemDto.unitPrice ?? product.price;
        const subtotal = unitPrice * itemDto.quantity;
        
        totalAmount += subtotal;

        const saleItem = this.saleItemRepository.create({
          productId: product.id,
          quantity: itemDto.quantity,
          unitPrice: unitPrice,
          subtotal: subtotal,
        });

        saleItemsToSave.push(saleItem);
      }

      const sale = queryRunner.manager.create(Sale, {
        storeId: createSaleDto.storeId,
        workerId: createSaleDto.workerId,
        serviceOrderId: createSaleDto.serviceOrderId,
        document: createSaleDto.document,
        paymentMethod: createSaleDto.paymentMethod,
        totalAmount: totalAmount,
      });

      const savedSale = await queryRunner.manager.save(sale);

      for (const item of saleItemsToSave) {
        item.sale = savedSale;
        await queryRunner.manager.save(SaleItem, item);
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedSale.id);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(storeId?: number): Promise<Sale[]> {
    if (storeId) {
      return this.saleRepository.find({
        where: { storeId },
        order: { createdAt: 'DESC' },
      });
    }
    return this.saleRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!sale) {
      throw new NotFoundException(`Venda #${id} não encontrada.`);
    }

    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.saleRepository.preload({
      id: id,
      ...updateSaleDto,
    });

    if (!sale) {
      throw new NotFoundException(`Venda #${id} não encontrada.`);
    }

    return this.saleRepository.save(sale);
  }

  async remove(id: number): Promise<void> {
    const result = await this.saleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Venda #${id} não encontrada.`);
    }
  }
}