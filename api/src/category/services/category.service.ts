import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategories(categories: { userId: number; name: string; keywords: string[] }[]) {
    const createdCategories = [];

    for (const category of categories) {
      const newCategory = await this.prisma.category.create({
        data: {
          name: category.name,
          userId: category.userId,
          keywords: {
            create: category.keywords.map(keyword => ({ keyword })),
          },
        },
        include: { keywords: true },
      });

      createdCategories.push(newCategory);
    }

    return { message: 'Categorias criadas com sucesso!', categories: createdCategories };
  }

  async categorizeTransaction(userId: number, description: string): Promise<number | null> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      include: { keywords: true },
    });

    for (const category of categories) {
      if (category.keywords.some(k => description.toLowerCase().includes(k.keyword.toLowerCase()))) {
        return category.id; 
      }
    }

    return null; 
  }

  async getTransactionsByCategory(categoryId: number) {
    return this.prisma.transaction.findMany({
      where: { categoryId },
      include: {
        category: true, 
      },
    });
  }
  
}
