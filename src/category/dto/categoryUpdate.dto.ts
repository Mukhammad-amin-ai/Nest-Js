import {
  IsString,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class Children {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsOptional()
  @IsNumber()
  productAmount: number;

  @IsOptional()
  @IsBoolean()
  adult: boolean;

  @IsOptional()
  @IsBoolean()
  eco: boolean;

  @IsOptional()
  @IsString()
  iconLink: string;

  @IsOptional()
  @IsString()
  seoMetaTag: string;

  @IsOptional()
  @IsString()
  seoHeader: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Children)
  children: Children[];
}

export class CategoryUpdateDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  icon: string;

  @IsOptional()
  @IsString()
  iconSvg: string;

  @IsOptional()
  @IsString()
  iconLink: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Children)
  children: Children[];
}
