import { Body, Injectable } from '@nestjs/common';
import { ExampleDto } from './dto/example.dto';

@Injectable()
export class ExampleService {
  example: ExampleDto[];
  constructor() {
    this.example = [
      {
        id: 1,
        name: 'maga',
        title: 'hello maga',
      },
    ];
  }

  getExample() {
    return this.example;
  }

  createExample(dto: ExampleDto): ExampleDto[] {
    const data: ExampleDto = {
      ...dto,
      id: new Date().getTime(),
    };
    this.example.push(data);
    return this.example;
  }
}
