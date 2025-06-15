import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleDto } from './dto/example.dto';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/all')
  @HttpCode(200)
  getExample(): ExampleDto[] {
    return this.exampleService.getExample();
  }

  @Post('/create')
  @HttpCode(201)
  create(@Body() dto: ExampleDto): ExampleDto[] {
    return this.exampleService.createExample(dto);
  }
}
