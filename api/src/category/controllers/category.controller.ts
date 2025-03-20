import { Controller, Post, Body } from '@nestjs/common';
import { CategoryService } from '../services/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategories(@Body() categories: { userId: number; name: string; keywords: string[] }[]) {
    return this.categoryService.createCategories(categories);
  }
}
