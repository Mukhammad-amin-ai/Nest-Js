import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';

class Discount {
  @IsNumber()
  discountPrice: number;

  @IsNumber()
  discountAmount: number;
}
class Badges {
  @IsBoolean()
  salleOut: boolean;

  @IsBoolean()
  coupleDay: boolean;

  @IsBoolean()
  origin: boolean;

  @IsBoolean()
  cheep: boolean;
}

class Photos {
  @IsString()
  image: string;

  @IsBoolean()
  main: boolean;
}

export class CreateProductDto {
  @IsNumber()
  discountPrice: number;

  @IsNumber()
  discountAmount: number;

  @IsBoolean()
  salleOut: boolean;

  @IsBoolean()
  coupleDay: boolean;

  @IsBoolean()
  origin: boolean;

  @IsBoolean()
  cheep: boolean;

  @IsString()
  image: string;

  @IsBoolean()
  main: boolean;

  @IsString()
  title: string;

  @IsNumber()
  minPrice: number;

  @IsNumber()
  maxPrice: number;

  @IsBoolean()
  adult: boolean;

  @IsBoolean()
  eco: boolean;

  @IsBoolean()
  favorit: boolean;

  @IsNumber()
  feedbackQuantity: number;

  @IsNumber()
  rating: number;

  @IsArray()
  categoryPath: number[];

  @IsBoolean()
  offer: boolean;

  @ValidateNested()
  @Type(() => Discount)
  discount: Discount;

  @ValidateNested()
  @Type(() => Badges)
  badges: Badges;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Photos)
  photos: Photos[];
}
