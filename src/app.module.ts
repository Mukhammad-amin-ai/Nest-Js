import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [ProductsModule, AuthModule, ExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
