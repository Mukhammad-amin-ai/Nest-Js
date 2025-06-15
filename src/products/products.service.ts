import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  getProduct(): string {
    return 'Product';
  }
}
