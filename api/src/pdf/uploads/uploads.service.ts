import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { extractTransactions } from '../extract/extract.factory';
import { ProcessService } from '../process/process.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsTypes } from '@prisma/client';
import { CategoryService } from '../../category/services/category.service';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService // 🔹 Injetando o serviço de categorias
  ) {}

  async processPDF(file: Express.Multer.File, userId: number) {
    try {
      const data = await pdfParse(file.buffer);
      const extractedText = data.text;

      const transactions = extractTransactions(extractedText);
      const processedData = ProcessService.processExtractedData({
        message: 'PDF processado com sucesso!',
        transactions,
      });

      for (const transaction of processedData.transactions) {
        // 🔹 Encontra uma categoria baseada na descrição
        const categoryId = await this.categoryService.categorizeTransaction(userId, transaction.description);

        await this.prisma.transaction.create({
          data: {
            date: new Date(transaction.date),
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type as TransactionsTypes,
            categoryId, // 🔹 Agora adicionando a categoria na transação
            userId,
          },
        });
      }

      return {
        message: 'Transações salvas no banco!',
        transactions: processedData.transactions,
      };
    } catch (error) {
      throw new Error('Erro ao processar PDF: ' + (error as any).message);
    }
  }
}
