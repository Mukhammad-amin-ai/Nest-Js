import { Controller, Get, HttpCode, Param, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  category: CategoryDto[];
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  @Get()
  @HttpCode(200)
  getAllCategory() {
    return this.categoryModel.find({});
  }

  @Get(':id')
  @HttpCode(200)
  getOneCategory(@Param('id') id: string) {
    return this.categoryModel.findById(id);
  }

  @Post()
  @HttpCode(201)
  createCategory(@Body() body: CategoryDto) {
    return this.categoryModel.create(body);
  }
}
