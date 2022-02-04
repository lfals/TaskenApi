import { ProductsEntity } from '@entities';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Ibody, Iparam } from '@interfaces';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() body: ProductsEntity) {
    return this.productsService.createProduct(body);
  }

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('total')
  async getTotalProducts() {
    return this.productsService.getTotalProducts();
  }

  @Get('stock/lower')
  async getLowerStockProduct() {
    return this.productsService.getLowerStockProduct();
  }

  @Get('stock/greater')
  async getGreaterStockProduct() {
    return this.productsService.getGreaterStockProduct();
  }

  @Get('stock/low')
  async getProductsWithoutStock() {
    return this.productsService.getProductsWithoutStock();
  }

  @Get('id/:id')
  async getProduct(@Param() param: ProductsEntity) {
    return this.productsService.getProduct(param.id);
  }

  @Patch('id/:id')
  async updateProduct(@Param() id: Iparam, @Body() body: ProductsEntity) {
    return this.productsService.updateProduct(id, body);
  }

  @Delete('id/:id')
  async deleteProduct(@Param() id: Iparam) {
    return this.productsService.deleteProduct(id);
  }

  @Post('sell/:id')
  async sellProduct(@Param() id: Iparam, @Body() body: Ibody) {
    return this.productsService.sellProduct(id, body);
  }
}
