import { IsString, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Children {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsNumber()
  productAmount: number;

  @IsBoolean()
  adult: boolean;

  @IsBoolean()
  eco: boolean;

  @IsString()
  iconLink: string;

  @IsString()
  seoMetaTag: string;

  @IsString()
  seoHeader: string;

  @ValidateNested({ each: true })
  @Type(() => Children)
  children: Children[];
}

export class CategoryDto {
  @IsString()
  title: string;

  @IsString()
  icon: string;

  @IsString()
  iconSvg: string;

  @IsString()
  iconLink: string;

  @ValidateNested({ each: true })
  @Type(() => Children)
  children: Children[];
}
