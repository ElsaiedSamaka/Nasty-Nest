import mongoose, { Types } from 'mongoose';
import slugify from 'slugify';

import { BrandService } from '@modules/brand/brand.service';
import { HistoryService } from '@modules/history/history.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { IProductDocument } from './interfaces/product.interface';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductService extends BaseService<ProductRepository> {
  constructor(
    protected readonly repository: ProductRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
    protected readonly categoryService: CategoryService,
    protected readonly brandService: BrandService,
    protected readonly sizeService: SizeService,
    protected readonly tagService: TagService,
    protected readonly colorService: ColorService,
    protected readonly historyService: HistoryService,
  ) {
    super();
  }

  async create(createProductDto: CreateProductDto): Promise<IProductDocument> {
    const data = {
      ...createProductDto,
      slug: slugify(createProductDto.name, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      }),
    };
    return this.repository.create(data);
  }

  async updateById(
    id: string | Types.ObjectId,
    data: UpdateProductDto,
  ): Promise<IProductDocument> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    if (data.details) {
      Object.keys(data.details).forEach((key) => {
        if (data.details[key] === '') {
          delete data.details[key];
        } else {
          item.details[key] = data.details[key];
        }
      });

      data.details = item.details;
    }

    return this.repository.updateById(id, data);
  }

  async findById(id: string | Types.ObjectId, user?: any): Promise<any> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    if (user) {
      await this.historyService.create({
        user: new mongoose.Types.ObjectId(user._id),
        product: product._id,
        isAnonymous: false,
      });
    } else {
      await this.historyService.create({
        product: product._id,
        isAnonymous: true,
      });
    }

    return product;
  }
}
