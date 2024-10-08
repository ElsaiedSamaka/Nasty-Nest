import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { CreateProductDto } from './dtos/create-product.dto';
import { FindProductsDto } from './dtos/find-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
@Roles(RoleTypeEnum.All)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly service: ProductService) {}

  // Route: POST /products
  @Post()
  // Roles: Vendor, SuperAdmin, Admin
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  // Swagger
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto, description: 'Product Information' })
  // Controller
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  // Route: PUT /products/:id
  @Put(':id')
  // Roles: Vendor, SuperAdmin, Admin
  @ApiOkResponse({ description: 'The product has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Updated Product Information',
  })
  // Controller
  updateById(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.updateById(id, data);
  }

  // Route: GET /products
  @Get()
  // Decorator for allowing anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOkResponse({ description: 'Successfully fetched products.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ type: FindProductsDto, description: 'Pagination options' })
  // Controller
  findAll(@Query(new PaginationPipe()) q: FindProductsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  // Route: GET /products/:id
  @Get(':id')
  // Decorator for allowing anonymous access
  @AllowAnonymous()
  // Swagger
  @ApiOkResponse({ description: 'Successfully fetched product.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  // Controller
  findById(@Param('id') id: string, @AuthUser() user: any) {
    return this.service.findById(id, user);
  }

  // Route: DELETE /products/:id
  @Delete(':id')
  // Roles: Vendor, SuperAdmin, Admin
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  // Swagger
  @ApiOkResponse({ description: 'Successfully deleted product.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  // Controller
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

}
