import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Example, ExampleSchema } from './schema/example.schema';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
  imports: [
    MongooseModule.forFeature([{ name: Example.name, schema: ExampleSchema }]),
  ],
})
export class ExampleModule {}
