import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
// IsArray,

export class CategoryChildrenDTO {
  @IsString()
  title: string;

  @IsNumber()
  productAmount: number;

  @IsBoolean()
  adult: boolean;

  @IsBoolean()
  eco: boolean;

  // @IsString()
  iconLink: string;

  // @IsString()
  seoMetaTag: string;

  // @IsString()
  seoHeader: string;

  @ValidateNested()
  @Type(() => CategoryChildrenDTO)
  children: CategoryChildrenDTO[];

  path: string[];
}

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  icon: string;

  @IsString()
  iconSvg: string;

  // @IsString()
  iconLink: string;

  @ValidateNested()
  @Type(() => CategoryChildrenDTO)
  children: CategoryChildrenDTO[];

  //   @IsArray()
  //   path: string[];
}
