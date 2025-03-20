import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsTypes } from '@prisma/client';
import { ProcessService } from '../process/process.service';
import { CategoryService } from '../../category/services/category.service';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService
  ) {}

  async processCSV(file: Express.Multer.File, userId: number) {
    try {
      const csvContent = file.buffer.toString('utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ',',
        trim: true,
      });

      const transactions = records.map((record: any) => ({
        date: record['Data'],
        amount: parseFloat(record['Valor']),
        description: record['Descrição'],
        type: record['Tipo'] as TransactionsTypes, // Supondo que o CSV tenha essa coluna
      }));

      const processedData = ProcessService.processExtractedData({
        message: 'CSV processado com sucesso!',
        transactions,
      });

      for (const transaction of processedData.transactions) {
        // 🔹 Classifica a transação baseado na descrição
        const { categoryId, subcategoryId, isEssential } = 
          await this.categoryService.categorizeTransaction(userId, transaction.description);

        await this.prisma.transaction.create({
          data: {
            date: new Date(transaction.date),
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type as TransactionsTypes,
            categoryId,       // ✅ Categoria corretamente atribuída
            subcategoryId,    // ✅ Subcategoria incluída
            userId,
            isEssential
          },
        });
      }

      return {
        message: 'Transações salvas no banco!',
        transactions: processedData.transactions,
      };
    } catch (error) {
      throw new Error('Erro ao processar CSV: ' + (error as any).message);
    }
  }
}