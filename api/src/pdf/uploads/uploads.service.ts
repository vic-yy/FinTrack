import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { extractTransactions } from '../extract/extract.factory';
import { ProcessService } from '../process/process.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsTypes } from '@prisma/client';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async processPDF(file: Express.Multer.File) {
    try {
      const data = await pdfParse(file.buffer);
      const extractedText = data.text;

      console.log(extractedText);
      const transactions = extractTransactions(extractedText);
      const processedData = ProcessService.processExtractedData({ 
        message: 'PDF processado com sucesso!', 
        transactions 
      });

      for (const transaction of processedData.transactions) {
        await this.prisma.transaction.create({
          data: {
            date: new Date(transaction.date),
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type as TransactionsTypes,
            userId: 1,
          },
        });
      }

      return { 
        message: 'Transações salvas no banco!', 
        transactions: processedData.transactions 
      };
    } catch (error) {
      throw new Error('Erro ao processar PDF: ' + (error as any).message);
    }
  }
}
