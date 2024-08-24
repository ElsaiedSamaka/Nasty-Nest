import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

class DetailsDto {
  [key: string]: any;
}

export class CreateProductDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Product name',
    example: 'Product 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product description',
    example: 'Product 1 description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Product price',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Product currency',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Product quantity',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ValidateNested()
  @Type(() => DetailsDto)
  details?: DetailsDto;
}
