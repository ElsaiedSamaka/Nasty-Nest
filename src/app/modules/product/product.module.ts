import { UserModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';

import { Product, ProductSchema } from './models/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { HistoryModule } from '@modules/history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => AwsModule),
    forwardRef(() => UserModule),
    forwardRef(() => HistoryModule),
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
