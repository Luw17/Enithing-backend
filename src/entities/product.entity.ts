import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sale_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_price: number;

  @Column({ type: 'int', default: 0 })
  quantity_in_stock: number;

  @Index({ unique: true, where: '("sku" IS NOT NULL)' })
  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  supplier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}