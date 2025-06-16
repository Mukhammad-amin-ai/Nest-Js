import { Injectable } from '@nestjs/common';
import { ExampleDto } from './dto/example.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Example, ExampleDocument } from './schema/example.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExampleService {
  example: ExampleDto[];
  constructor(
    @InjectModel(Example.name) private exampleModel: Model<ExampleDocument>
  ) {}

  getExample() {
    return this.exampleModel.find({});
  }

  getByID(id: string) {
    return this.exampleModel.findById(id);
  }

  createExample(dto: ExampleDto) {
    return this.exampleModel.create(dto);
  }

  updateById(id: string, dto: ExampleDto) {
    return this.exampleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  deletById(id: string) {
    return this.exampleModel.findByIdAndDelete(id);
  }
}
