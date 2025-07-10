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

  @Prop({ type: [Number], default: [] })
  path: number[];
}

@Schema()
export class Category {
  @Prop({ type: Number })
  _id: number; // Custom _id field

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

  @Prop({ type: [Number], default: [] })
  path: number[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Disable the default _id and __v fields behavior
CategorySchema.set('_id', false);
CategorySchema.set('versionKey', false);

// Pre-save middleware to auto-increment _id
CategorySchema.pre('save', async function (next) {
  if (this.isNew) {
    const Model = this.constructor as any;
    try {
      // Find the highest _id and increment by 1
      const lastDoc = await Model.findOne({}, {}, { sort: { _id: -1 } });
      this._id = lastDoc ? lastDoc._id + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// ✅ Removed the explicit _id index - MongoDB handles _id indexing automatically
// Even with custom _id fields, MongoDB will create the necessary index
