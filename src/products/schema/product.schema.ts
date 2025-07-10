import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
class Discount {
  @Prop({ required: true })
  discountPrice: number;

  @Prop({ required: true })
  discountAmount: number;
}

@Schema()
class Badges {
  @Prop({ required: true })
  salleOut: boolean;

  @Prop({ required: true })
  coupleDay: boolean;

  @Prop({ required: true })
  origin: boolean;

  @Prop({ required: true })
  cheep: boolean;
}

@Schema()
class Photos {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  main: boolean;
}

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  minPrice: number;

  @Prop({ required: true })
  maxPrice: number;

  @Prop({ required: true, default: false })
  adult: boolean;

  @Prop({ required: true, default: false })
  eco: boolean;

  @Prop({ required: true, default: false })
  favorit: boolean;

  @Prop({ required: true })
  feedbackQuantity: number;

  @Prop({ required: true })
  rating: number;

  @Prop({ type: [Number], required: true, default: [] })
  categoryPath: number[];

  @Prop({ required: true, default: null })
  offer: boolean;

  @Prop({ required: true })
  discount: Discount;

  @Prop({ required: true })
  badges: Badges;

  @Prop({ required: true })
  photos: [Photos];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
