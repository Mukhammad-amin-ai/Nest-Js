import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ _id: false }) // отключаем автоматическое _id на обертке Children, чтобы вручную указать внутри
class Children {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  productAmount: number;

  @Prop()
  adult: boolean;

  @Prop()
  eco: boolean;

  @Prop({ default: [] })
  children: Children[];

  @Prop({ type: [String], default: [] })
  path: string[];
}

export const ChildrenSchema = SchemaFactory.createForClass(Children);

@Schema()
export class Category {
  @Prop()
  title: string;

  @Prop()
  icon: string;

  @Prop()
  iconSvg: string;

  @Prop()
  iconLink: string;

  @Prop({ type: [ChildrenSchema], default: [] })
  children: Children[];

  @Prop({ type: [String], default: [] })
  path: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
