import { IsInt, IsString, IsNotEmpty, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleItemDto } from './create-sale-item.dto';

export class CreateSaleDto {
  @IsInt()
  @IsNotEmpty()
  storeId: number;

  @IsInt()
  @IsOptional()
  workerId?: number;

  @IsInt()
  @IsOptional()
  serviceOrderId?: number;

  @IsString()
  @IsOptional()
  document?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}