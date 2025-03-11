import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessService {
  static processExtractedData(extractedData: any): any {
    if (!extractedData || !extractedData.transactions) {
      return { message: 'Nenhuma transação encontrada.', transactions: [] };
    }

    const formattedTransactions = extractedData.transactions.map((transaction: any) => {
      const formattedDate = ProcessService.formatDate(transaction.date);
      const formattedAmount = ProcessService.formatAmount(transaction.amount);
      const type = formattedAmount < 0 ? 'WITHDRAWAL' : 'INCOME';

      return {
        date: formattedDate,
        description: transaction.description.trim(),
        amount: formattedAmount,
        type,
      };
    });

    return {
      message: extractedData.message,
      transactions: formattedTransactions,
    };
  }

  private static formatDate(dateString: string): string {
    const parts = dateString.split('/');
    if (parts.length !== 3) return dateString;

    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private static formatAmount(amount: any): number {
    if (typeof amount === 'string') {
      amount = amount.replace(',', '.').trim();
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
      console.warn(`⚠️ Valor inválido detectado: "${amount}". Retornando 0.`);
      return 0;
    }

    return numericAmount;
  }
}
