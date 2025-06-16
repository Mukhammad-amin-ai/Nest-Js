import { Injectable, NotFoundException } from '@nestjs/common';
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

  getByID(id: number): ExampleDto {
    const item = this.example.find((e) => e.id === id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  createExample(dto: ExampleDto): ExampleDto[] {
    const data: ExampleDto = {
      ...dto,
      id: new Date().getTime(),
    };
    this.example.push(data);
    return this.example;
  }

  updateById(id: number, dto: ExampleDto): ExampleDto {
    let currentExample = this.example.find((e) => e.id === id);
    if (!currentExample) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    currentExample = dto;
    return currentExample;
  }

  deletById(id: number): ExampleDto[] {
    const currentExample = this.example.filter((e) => e.id !== id);
    if (!currentExample) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return currentExample;
  }
}
