import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CategoryDto } from './dto/category.dto';
import { CategoryUpdateDto } from './dto/categoryUpdate.dto';

@Controller('category')
export class CategoryController {
  category: CategoryDto[];
  categoryUpdate: CategoryUpdateDto[];
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

  @Patch(':id')
  @HttpCode(200)
  updateCategory(@Param('id') id: string, @Body() data: CategoryUpdateDto) {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  @Delete(':id')
  @HttpCode(200)
  deleteCategory(@Param('id') id: string) {
    return this.categoryModel.findByIdAndDelete(id, { new: true });
  }
}
