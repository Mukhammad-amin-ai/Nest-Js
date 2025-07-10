import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModule: Model<ProductDocument>
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.ProductModule.create(createProductDto);
  }

  async createMany(createProductDto: CreateProductDto[]) {
    const createdProducts: Product[] = [];

    for (const product of createProductDto) {
      const created = await this.ProductModule.create(product);
      createdProducts.push(created);
    }

    return createdProducts;
  }

  findAll() {
    return this.ProductModule.find();
  }

  findOne(id: number) {
    return this.ProductModule.findById(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${updateProductDto.title} product`;
  }

  remove(id: number) {
    return this.ProductModule.deleteOne({ id });
  }
}
