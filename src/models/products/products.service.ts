import { ProductsEntity } from '@entities';
import { Ibody, Iparam } from '@interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
  ) {}

  async createProduct(product: ProductsEntity) {
    const newProduct = new ProductsEntity();

    newProduct.name = product.name;
    newProduct.manufacturer = product.manufacturer;
    newProduct.stock = product.stock;
    newProduct.price = product.price;

    await this.productsRepository
      .findOne({ name: product.name })
      .then((product) => {
        if (product)
          throw new HttpException('User Already exists', HttpStatus.CONFLICT);
        return this.productsRepository.save(newProduct).then((product) => {
          throw new HttpException(
            {
              message: 'Product Created',
              id: product.id,
            },
            HttpStatus.CREATED,
          );
        });
      });
  }

  async getAllProducts() {
    return await this.productsRepository.find();
  }

  async getProduct(id) {
    return this.productsRepository
      .findByIds(id)
      .then((product) => product)
      .catch(() => {
        throw new HttpException(
          {
            message: 'Product not found',
            id: id,
          },
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async updateProduct(id: Iparam, body: ProductsEntity) {
    await this.productsRepository
      .findOne({ name: body.name })
      .then((product) => {
        if (product)
          throw new HttpException(
            'Product Name Already exists',
            HttpStatus.CONFLICT,
          );

        return this.productsRepository
          .save({ ...id, ...body })
          .then((response) => {
            throw new HttpException('Product updated', HttpStatus.OK);
          });
      })
      .catch(() => {
        throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
      });
  }

  async deleteProduct(id: Iparam) {
    return this.productsRepository.findOne(id).then(async (product) => {
      if (!product)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      return this.productsRepository.delete(id).then(() => {
        throw new HttpException('Product deleted', HttpStatus.OK);
      });
    });
  }

  async getTotalProducts() {
    return this.productsRepository.count();
  }

  async getLowerStockProduct() {
    return this.productsRepository
      .find({
        order: {
          stock: 'ASC',
        },
      })
      .then((product) => product[0]);
  }

  async getGreaterStockProduct() {
    return this.productsRepository
      .find({
        order: {
          stock: 'DESC',
        },
      })
      .then((product) => product[0]);
  }

  async getProductsWithoutStock() {
    return this.productsRepository
      .find({
        where: {
          stock: LessThan(5),
        },
      })
      .then((product) => {
        if (!product[0])
          throw new HttpException('No Products Found', HttpStatus.NO_CONTENT);
        return product[0];
      });
  }

  async sellProduct(id: Iparam, body: Ibody) {
    return this.productsRepository.find(id).then((product: any) => {
      const quantity = product[0].stock;
      product[0].stock = quantity - (body.quantity ? body.quantity : 1);
      if (product[0].stock < 0)
        throw new HttpException(
          { message: 'Insufficient stock', stock: quantity },
          HttpStatus.FORBIDDEN,
        );
      this.productsRepository.save(product[0]);
    });
  }
}
