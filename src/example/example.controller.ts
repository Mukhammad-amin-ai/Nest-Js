import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleDto } from './dto/example.dto';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/all')
  @HttpCode(200)
  getAll() {
    return this.exampleService.getExample();
  }

  @Get(':id')
  @HttpCode(200)
  getByID(@Param('id') id: string) {
    return this.exampleService.getByID(id);
  }

  @Post('/create')
  @HttpCode(201)
  create(@Body() dto: ExampleDto) {
    return this.exampleService.createExample(dto);
  }

  @Put(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() dto: ExampleDto) {
    return this.exampleService.updateById(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id') id: string) {
    return this.exampleService.deletById(id);
  }
}
