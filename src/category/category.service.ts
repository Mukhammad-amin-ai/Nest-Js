import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';

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

interface ProcessedChild {
  id: number;
  title: string;
  productAmount: number;
  adult: boolean;
  eco: boolean;
  iconLink?: string;
  seoMetaTag?: string;
  seoHeader?: string;
  children: ProcessedChild[];
  path: number[];
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async createBatch(payload: {
    payload: CreateCategoryDto[];
  }): Promise<Category[]> {
    const results: Category[] = [];

    for (const categoryData of payload.payload) {
      try {
        const nextId = await this.getNextId();

        const existingCategory = await this.categoryModel.findOne({
          _id: nextId,
        });
        if (existingCategory) {
          throw new ConflictException(
            `Category with ID ${nextId} already exists`
          );
        }

        // Process children with auto-generated IDs and paths
        const processedChildren = this.processChildrenWithPaths(
          categoryData.children || [],
          [1, nextId] // Root path starts with [1, categoryId]
        );

        const newCategory = new this.categoryModel({
          ...categoryData,
          _id: nextId,
          path: [1, nextId], // Root level path
          children: processedChildren,
        });

        const savedCategory = await newCategory.save();
        results.push(savedCategory);
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException('Category ID already exists');
        }
        throw error;
      }
    }

    return results;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const nextId = await this.getNextId();

      const existingCategory = await this.categoryModel.findOne({
        _id: nextId,
      });
      if (existingCategory) {
        throw new ConflictException(
          `Category with ID ${nextId} already exists`
        );
      }

      // Process children with paths
      const processedChildren = this.processChildrenWithPaths(
        createCategoryDto.children || [],
        [1, nextId] // Root path starts with [1, categoryId]
      );

      const newCategory = new this.categoryModel({
        ...createCategoryDto,
        _id: nextId,
        path: [1, nextId], // Root level path
        children: processedChildren,
      });

      return await newCategory.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Category ID already exists');
      }
      throw error;
    }
  }

  async addChildToCategory(
    categoryId: number,
    childData: CreateChildDto,
    parentPath?: string
  ): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id: categoryId });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Generate child ID if not provided
    const childId = childData.id || (await this.getNextChildId(category));

    // Calculate path for the new child
    let newPath: number[];
    if (parentPath) {
      // Adding to nested child
      const pathArray = parentPath.split('.').map(Number);
      newPath = [1, categoryId, ...pathArray, childId];
    } else {
      // Adding directly to category
      newPath = [1, categoryId, childId];
    }

    const newChild: ProcessedChild = {
      id: childId,
      title: childData.title,
      productAmount: childData.productAmount,
      adult: childData.adult ?? false,
      eco: childData.eco ?? false,
      iconLink: childData.iconLink,
      seoMetaTag: childData.seoMetaTag,
      seoHeader: childData.seoHeader,
      path: newPath,
      children: this.processChildrenWithPaths(
        childData.children || [],
        newPath
      ),
    };

    if (parentPath) {
      // Add to nested child
      this.addToNestedChild(
        category.children,
        parentPath.split('.').map(Number),
        newChild
      );
    } else {
      // Add directly to category
      category.children.push(newChild as any);
    }

    return await category.save();
  }

  private processChildrenWithPaths(
    children: CreateChildDto[],
    basePath: number[]
  ): ProcessedChild[] {
    let childIdCounter = 1;

    return children.map((child) => {
      // Auto-generate ID if not provided
      const childId =
        child.id || this.getNextChildIdFromPath(basePath, childIdCounter++);
      const childPath = [...basePath, childId];

      return {
        id: childId,
        title: child.title,
        productAmount: child.productAmount,
        adult: child.adult ?? false,
        eco: child.eco ?? false,
        iconLink: child.iconLink,
        seoMetaTag: child.seoMetaTag,
        seoHeader: child.seoHeader,
        path: childPath,
        children: this.processChildrenWithPaths(
          child.children || [],
          childPath
        ),
      };
    });
  }

  private getNextChildIdFromPath(basePath: number[], counter: number): number {
    // Generate ID based on parent path and counter
    const baseId = basePath[basePath.length - 1]; // Get parent ID
    return baseId + counter;
  }

  private addToNestedChild(
    children: any[],
    pathArray: number[],
    newChild: ProcessedChild
  ): void {
    if (pathArray.length === 1) {
      const targetChild = children.find((child) => child.id === pathArray[0]);
      if (targetChild) {
        targetChild.children.push(newChild);
      }
    } else {
      const targetChild = children.find((child) => child.id === pathArray[0]);
      if (targetChild) {
        this.addToNestedChild(
          targetChild.children,
          pathArray.slice(1),
          newChild
        );
      }
    }
  }

  private getNextChildId(category: Category) {
    const allChildIds = this.getAllChildIds(category.children);
    return allChildIds.length > 0 ? Math.max(...allChildIds) + 1 : 1;
  }

  private getAllChildIds(children: any[]): number[] {
    const ids: number[] = [];
    for (const child of children) {
      ids.push(child.id);
      if (child.children && child.children.length > 0) {
        ids.push(...this.getAllChildIds(child.children));
      }
    }
    return ids;
  }

  async createWithCustomId(
    createCategoryDto: CreateCategoryDto,
    customId: number
  ): Promise<Category> {
    try {
      const existingCategory = await this.categoryModel.findOne({
        _id: customId,
      });
      if (existingCategory) {
        throw new ConflictException(
          `Category with ID ${customId} already exists`
        );
      }

      // Process children with paths
      const processedChildren = this.processChildrenWithPaths(
        createCategoryDto.children || [],
        [1, customId]
      );

      const newCategory = new this.categoryModel({
        ...createCategoryDto,
        _id: customId,
        path: [1, customId],
        children: processedChildren,
      });

      return await newCategory.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Category with ID ${customId} already exists`
        );
      }
      throw error;
    }
  }

  private async getNextId(): Promise<number> {
    const lastCategory = await this.categoryModel
      .findOne({}, {}, { sort: { _id: -1 } })
      .exec();

    return lastCategory ? lastCategory._id + 1 : 10020; // Start from 10020 like in your example
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryModel.findOne({ _id: id }).exec();
  }

  async update(id: number, updateCategoryDto: any): Promise<Category | null> {
    return this.categoryModel
      .findOneAndUpdate({ _id: id }, updateCategoryDto, { new: true })
      .exec();
  }

  async remove(id: number): Promise<void> {
    await this.categoryModel.findOneAndDelete({ _id: id }).exec();
  }
}
