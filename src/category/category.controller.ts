// import {
//   Controller,
//   Get,
//   HttpCode,
//   Param,
//   Post,
//   Body,
//   Patch,
//   Delete,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Category, CategoryDocument } from './schema/category.schema';
// import { CategoryDto } from './dto/category.dto';
// import { CategoryUpdateDto } from './dto/categoryUpdate.dto';

// @Controller('category')
// export class CategoryController {
//   category: CategoryDto[];
//   categoryUpdate: CategoryUpdateDto[];
//   constructor(
//     @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
//   ) {}

//   @Get()
//   @HttpCode(200)
//   getAllCategory() {
//     return this.categoryModel.find({});
//   }

//   @Get(':id')
//   @HttpCode(200)
//   getOneCategory(@Param('id') id: string) {
//     return this.categoryModel.findById(id);
//   }

//   @Post()
//   @HttpCode(201)
//   createCategory(@Body() body: CategoryDto) {
//     return this.categoryModel.create(body);
//   }

//   @Patch(':id')
//   @HttpCode(200)
//   updateCategory(@Param('id') id: string, @Body() data: CategoryUpdateDto) {
//     return this.categoryModel.findByIdAndUpdate(id, data, { new: true });
//   }

//   @Delete(':id')
//   @HttpCode(200)
//   deleteCategory(@Param('id') id: string) {
//     return this.categoryModel.findByIdAndDelete(id, { new: true });
//   }
// }
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';

interface CreateCategoryDto {
  title: string;
  icon?: string;
  iconSvg: string;
  iconLink: string;
  children?: any[];
}

interface CreateChildDto {
  id?: number;
  title: string;
  productAmount: number;
  adult?: boolean;
  eco?: boolean;
  iconLink?: string;
  seoMetaTag?: string;
  seoHeader?: string;
  children?: CreateChildDto[];
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/batch')
  async createBatch(@Body() payload: { payload: CreateCategoryDto[] }) {
    // This will process multiple categories with auto-generated IDs and paths
    return this.categoryService.createBatch(payload);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    // This will auto-generate ID and paths
    return this.categoryService.create(createCategoryDto);
  }

  @Post('/custom/:id')
  async createWithCustomId(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    // This allows you to specify a custom ID
    const customId = parseInt(id, 10);
    return this.categoryService.createWithCustomId(createCategoryDto, customId);
  }

  @Post(':categoryId/children')
  async addChild(
    @Param('categoryId') categoryId: string,
    @Body() childData: CreateChildDto
  ) {
    // Add child directly to category
    return this.categoryService.addChildToCategory(
      parseInt(categoryId, 10),
      childData
    );
  }

  @Post(':categoryId/children/:parentPath')
  async addNestedChild(
    @Param('categoryId') categoryId: string,
    @Param('parentPath') parentPath: string,
    @Body() childData: CreateChildDto
  ) {
    // Add child to nested parent (parentPath like "10044.10398")
    return this.categoryService.addChildToCategory(
      parseInt(categoryId, 10),
      childData,
      parentPath
    );
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(parseInt(id, 10));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoryService.update(parseInt(id, 10), updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(parseInt(id, 10));
  }
}

// Example usage:
/*
// Create a category with nested children and auto-generated paths
const categoryData = {
  title: "Электроника",
  iconSvg: "<svg>...</svg>",
  iconLink: "https://example.com/icons/electronics.png",
  children: [
    {
      id: 10044,
      title: "Смартфоны и телефоны",
      productAmount: 7741,
      adult: false,
      eco: false,
      seoMetaTag: "Смартфоны и телефоны",
      seoHeader: "Смартфоны и телефоны",
      children: [
        {
          id: 10398,
          title: "Аксессуары для смартфонов",
          productAmount: 6733,
          adult: false,
          eco: false,
          seoMetaTag: "Аксессуары и запчасти",
          seoHeader: "Аксессуары и запчасти",
          children: []
        }
      ]
    }
  ]
};

// This will create:
// Category: { _id: 10020, path: [1, 10020], ... }
// Child: { id: 10044, path: [1, 10020, 10044], ... }
// Nested Child: { id: 10398, path: [1, 10020, 10044, 10398], ... }

// Add a new child to existing category
POST /categories/10020/children
{
  "title": "New Child",
  "productAmount": 100
}

// Add a nested child to existing child
POST /categories/10020/children/10044
{
  "title": "New Nested Child",
  "productAmount": 50
}
*/
