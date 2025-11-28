import { IsInt, IsNotEmpty, ValidateNested, ArrayMinSize, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductStockItem {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;
}

export class BulkUpdateStockDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductStockItem)
  items: ProductStockItem[];
}