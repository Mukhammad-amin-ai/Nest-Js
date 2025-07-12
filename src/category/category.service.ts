import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCategoryDto,
  CategoryChildrenDTO,
} from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

interface Children {
  _id: Types.ObjectId;
  title: string;
  productAmount: number;
  adult: boolean;
  eco: boolean;
  iconLink: string;
  seoMetaTag: string;
  seoHeader: string;
  children: Children[];
  path: string[];
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModule: Model<CategoryDocument>
  ) {}

  // async createCategory(createCategoryDto: CreateCategoryDto) {
  //   const category = await this.CategoryModule.create(createCategoryDto);
  //   const fatherId =
  //     category._id instanceof Types.ObjectId
  //       ? category._id.toString()
  //       : String(category._id);

  //   category.path.push(fatherId);

  //   if (createCategoryDto.children.length > 0) {
  //     for (
  //       let childCatElement = 0;
  //       childCatElement < createCategoryDto.children.length;
  //       childCatElement++
  //     ) {
  //       const childId = new Types.ObjectId();
  //       const miniId = new Types.ObjectId();
  //       const childWithId: Children = {
  //         ...createCategoryDto.children[childId],
  //         _id: childId,
  //         children: [],
  //         path: [...category.path, childId.toString()],
  //       };

  //       category.children.push(childWithId);
  //       if (createCategoryDto.children[childCatElement].children.length > 0) {
  //         const miniChildWithId: Children = {
  //           ...createCategoryDto.children[childId],
  //           _id: childId,
  //           children: [],
  //           path: [...category.path, childId.toString()],
  //         };
  //         category.children[childCatElement].children.push(miniChildWithId);
  //       }
  //     }
  //   }

  //   await category.save();

  //   return category;
  // }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = await this.CategoryModule.create(createCategoryDto);
    const fatherId =
      category._id instanceof Types.ObjectId
        ? category._id.toString()
        : String(category._id);

    // Set parent category path
    category.path = [fatherId];

    if (createCategoryDto.children && createCategoryDto.children.length > 0) {
      // Clear existing children array to avoid duplicates
      category.children = [];

      for (
        let childIndex = 0;
        childIndex < createCategoryDto.children.length;
        childIndex++
      ) {
        const childId = new Types.ObjectId();
        const childWithId: Children = {
          ...createCategoryDto.children[childIndex],
          _id: childId,
          children: [],
          path: [fatherId, childId.toString()], // Parent ID + Child ID
        };

        // Process nested children (grandchildren) if they exist
        if (
          createCategoryDto.children[childIndex].children &&
          createCategoryDto.children[childIndex].children.length > 0
        ) {
          for (
            let grandchildIndex = 0;
            grandchildIndex <
            createCategoryDto.children[childIndex].children.length;
            grandchildIndex++
          ) {
            const grandchildId = new Types.ObjectId();
            const grandchildWithId: Children = {
              ...createCategoryDto.children[childIndex].children[
                grandchildIndex
              ],
              _id: grandchildId,
              children: [],
              path: [fatherId, childId.toString(), grandchildId.toString()], // Parent + Child + Grandchild
            };

            childWithId.children.push(grandchildWithId);
          }
        }

        category.children.push(childWithId);
      }
    }

    await category.save();
    return category;
  }

  async createSubCategory(
    fatherId: string,
    CategoryChildrenDTO: CategoryChildrenDTO
  ) {
    const category = await this.CategoryModule.findOne({ _id: fatherId });
    if (!category) throw new NotFoundException('Parent category not found');

    const childId = new Types.ObjectId();

    const childWithId = {
      ...CategoryChildrenDTO,
      _id: childId,
      children: [],
      path: [...category.path, childId.toString()],
    };

    category.children.push(childWithId);
    await category.save();

    return childWithId;
  }

  async createMiniCategory(
    fatherId: string,
    childId: string,
    CategoryChildrenDTO: CategoryChildrenDTO
  ) {
    const category = await this.CategoryModule.findOne({ _id: fatherId });
    if (!category) throw new NotFoundException('Parent category not found');

    // Найдём нужного ребёнка (2 уровень)
    const child = category.children.find(
      (child) => child?._id?.toString() === childId
    );
    if (!child) throw new NotFoundException('Child not found');

    // Создаём mini-категорию (3 уровень)
    const miniCategoryId = new Types.ObjectId();
    const miniCategory = {
      ...CategoryChildrenDTO,
      _id: miniCategoryId,
      children: [],
      path: [...category.path, childId, miniCategoryId.toString()],
    };

    // Вставляем в child.children
    child.children.push(miniCategory);
    category.markModified('children');

    // Сохраняем всю категорию
    await category.save();

    return category;
  }

  async findAll() {
    return this.CategoryModule.find();
  }

  async findOne(id: number) {
    return this.CategoryModule.findOne({ _id: id });
  }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  async remove(id: number) {
    return this.CategoryModule.findOneAndDelete({ _id: id });
  }
}
