import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { CategoryService } from '../services/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategories(@Body() categories: any) {
    // ✅ Garante que `categories` seja um array antes de processar
    if (!Array.isArray(categories)) {
      throw new BadRequestException('O corpo da requisição deve ser um array de categorias.');
    }

    return this.categoryService.createCategories(categories);
  }

  @Get(':userId')
  async getCategories(@Param('userId') userId: string) {
    return this.categoryService.getCategories(Number(userId));
  }

  @Get(':categoryId/transactions')
  async getTransactionsByCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.getTransactionsByCategory(Number(categoryId));
  }
}
