import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ExampleModule } from './example/example.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';

const IMPORTS = [
  CategoryModule,
  UserModule,
  ProductsModule,
  AuthModule,
  ExampleModule,
  MongooseModule.forRoot('mongodb://localhost:27017/UZUM'),
];

@Module({
  imports: IMPORTS,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
