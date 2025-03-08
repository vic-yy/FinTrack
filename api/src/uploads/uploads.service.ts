import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { extractTransactions } from '../extract/extract.service';
import { ProcessService } from '../process/process.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async processPDF(file: Express.Multer.File) {
    try {
      const data = await pdfParse(file.buffer);
      const extractedText = data.text;

      // Extraindo transações
      const transactions = extractTransactions(extractedText);
      const processedData = ProcessService.processExtractedData({ message: 'PDF processado com sucesso!', transactions });

      // Salvando no banco
      for (const transaction of processedData.transactions) {
      
        await this.prisma.transaction.create({
          data: {
            date: new Date(transaction.date),
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
          },
        });
      }
      

      return { message: 'Transações salvas no banco!', transactions: processedData.transactions };
    } catch (error) {
      throw new Error('Erro ao processar PDF: ' + (error as any).message);
    }
  }
}
