import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;
@Schema()
class Children {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  productAmount: number;

  @Prop()
  adult: boolean;

  @Prop()
  eco: boolean;

  @Prop()
  iconLink: string;

  @Prop()
  seoMetaTag: string;

  @Prop()
  seoHeader: string;

  @Prop({ type: () => [Children], default: [] })
  children: Children;
}

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop()
  icon: string;

  @Prop({ required: true })
  iconSvg: string;

  @Prop({ required: true })
  iconLink: string;

  @Prop({ default: [] })
  children: Children[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
