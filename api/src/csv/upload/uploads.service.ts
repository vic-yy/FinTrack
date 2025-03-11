import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { ProcessService } from '../process/process.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsTypes } from '@prisma/client';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async processCSV(file: Express.Multer.File) {
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
      }));

      const processedData = ProcessService.processExtractedData({
        message: 'CSV processado com sucesso!',
        transactions,
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
        transactions: processedData.transactions,
      };
    } catch (error) {
      throw new Error('Erro ao processar CSV: ' + (error as any).message);
    }
  }
}
