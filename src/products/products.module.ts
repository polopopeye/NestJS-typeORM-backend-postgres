import { Module } from '@nestjs/common';

import { ProductsController } from './controllers/products.controller';
import { BrandsController } from './controllers/brands.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ProductsService } from './services/products.service';
import { BrandsService } from './services/brands.service';
import { CategoriesService } from './services/categories.service';
import { DatabaseModule } from 'src/database/database.module';
import { ProductProviders } from './providers/product.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController, CategoriesController, BrandsController],
  providers: [
    ProductsService,
    BrandsService,
    CategoriesService,
    ...ProductProviders,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
