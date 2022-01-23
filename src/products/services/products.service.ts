import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    // const product = this.products.find((item) => item.id === id); //sin repo
    const product = await this.productRepository.findOne(id); //con repo
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    // const newProduct = new Product();
    // newProduct.image = data.image;
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.price = data.price;
    // newProduct.stock = data.stock;
    const newProduct = this.productRepository.create(data);

    return this.productRepository.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productRepository.findOne(id);
    if (!product) throw new NotFoundException(`Product #${id} not found`);

    this.productRepository.merge(product, changes);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne(id);
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return this.productRepository.delete(id);
  }
}
