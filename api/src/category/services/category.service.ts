import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createCategories(categories: any[]) {
    if (!Array.isArray(categories)) {
      throw new BadRequestException('Esperado um array de categorias.');
    }

    const createdCategories = await this.prisma.$transaction(
      categories.map(category => 
        this.prisma.category.create({
          data: {
            name: category.name,
            userId: category.userId,
            isEssential: category.isEssential,
            keywords: {
              create: category.keywords?.map((kw: any) => ({ keyword: kw })) || [],
            },
            subcategories: {
              create: category.subcategories?.map((sub: { name: any; isEssential: any; keywords: any[]; }) => ({
                name: sub.name,
                isEssential: sub.isEssential ?? category.isEssential, // 🔹 Se não informado, herda da categoria principal
                keywords: {
                  create: sub.keywords?.map(kw => ({ keyword: kw })) || [],
                }
              })) || [],
            },
          },
          include: { subcategories: { include: { keywords: true } }, keywords: true },
        })
      )
    );

    return { message: 'Categorias criadas com sucesso!', categories: createdCategories };
  }

  async categorizeTransaction(userId: number, description: string): Promise<{ categoryId: number | null, subcategoryId: number | null, isEssential: boolean }> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      include: { 
        keywords: true,
        subcategories: { include: { keywords: true } }
      },
    });

    // 🔹 1. Primeiro, procurar a keyword dentro das SUBCATEGORIAS
    for (const category of categories) {
      for (const subcategory of category.subcategories) {
        if (subcategory.keywords.some(k => description.toLowerCase().includes(k.keyword.toLowerCase()))) {
          return { 
            categoryId: category.id, 
            subcategoryId: subcategory.id,
            isEssential: subcategory.isEssential ?? category.isEssential // 🔹 Prioriza `isEssential` da subcategoria
          };
        }
      }
    }

    // 🔹 2. Se não encontrou subcategoria, procurar keyword dentro das CATEGORIAS PRINCIPAIS
    for (const category of categories) {
      if (category.keywords.some(k => description.toLowerCase().includes(k.keyword.toLowerCase()))) {
        return { categoryId: category.id, subcategoryId: null, isEssential: category.isEssential };
      }
    }

    return { categoryId: null, subcategoryId: null, isEssential: false };
  }

  async getCategories(userId: number) {
    return this.prisma.category.findMany({
      where: { userId },
      include: { subcategories: { include: { keywords: true } }, keywords: true },
    });
  }

  
  async getTransactionsByCategory(categoryId: number) {
    return this.prisma.transaction.findMany({
      where: { categoryId },
      include: { category: true, subcategory: true },
    });
  }

  async getEssentialTransactionsBySubcategory(userId: number) {
    return this.prisma.subcategory.findMany({
      where: {
        transactions: {
          some: { userId, isEssential: true }
        }
      },
      include: {
        transactions: {
          where: { userId, isEssential: true },
          select: {
            id: true,
            date: true,
            description: true,
            amount: true,
            type: true,
          }
        }
      }
    });
  }
}
