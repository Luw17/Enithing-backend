import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [ProductModule, SaleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
