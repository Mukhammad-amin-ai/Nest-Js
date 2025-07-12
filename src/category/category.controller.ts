import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  // Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CategoryChildrenDTO,
} from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body()
    createCategoryDto: CreateCategoryDto
  ) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Post(':fatherId')
  createSubCategory(
    @Param('fatherId') fatherId: string,
    @Body() CategoryChildrenDTO: CategoryChildrenDTO
  ) {
    return this.categoryService.createSubCategory(
      fatherId,
      CategoryChildrenDTO
    );
  }

  @Post(':fatherId/subCategory/:childId')
  createMiniCategory(
    @Param('fatherId') fatherId: string,
    @Param('childId') childId: string,
    @Body() CategoryChildrenDTO: CategoryChildrenDTO
  ) {
    return this.categoryService.createMiniCategory(
      fatherId,
      childId,
      CategoryChildrenDTO
    );
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto
  // ) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
