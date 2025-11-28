import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'cost_price', nullable: true })
  costPrice: number;

  @Column({ type: 'int', default: 0, name: 'stock_quantity' })
  stockQuantity: number;

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ type: 'tinyint', width: 1, default: 1 }) 
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}