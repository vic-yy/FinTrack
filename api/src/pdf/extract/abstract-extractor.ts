import { Injectable, Logger } from '@nestjs/common';

export interface Transaction {
  date: string;
  description: string;
  amount: number;  // Valor numérico
  type: string;
  message?: string;
}

export interface CardExtractorOptions {
  regex: RegExp;
  typeMapping: (amount: number) => string;
}

@Injectable()
export abstract class CardExtractor {
  protected readonly logger = new Logger(this.constructor.name);
  protected abstract options: CardExtractorOptions;

  extractTransactions(text: string): Transaction[] {
    const transactions: Transaction[] = [];
    let match: RegExpExecArray | null;

    // Processa todas as ocorrências com base na regex definida
    while ((match = this.options.regex.exec(text)) !== null) {
      const rawDate = match[1].trim();
      const rawDescription = match[2].trim();
      const negativeIndicator = match[3]; // Pode ser undefined ou conter o sinal negativo
      // Converte o valor removendo separadores e tratando a vírgula como separador decimal
      let rawAmount = match[4].replace(/\./g, '').replace(',', '.');
      let amount = parseFloat(rawAmount);

      // Se existir um indicador negativo, inverte o valor
      if (negativeIndicator) {
        amount *= -1;
      }
      
      const type = this.options.typeMapping(amount);

      const transaction: Transaction = {
        date: rawDate,
        description: rawDescription,
        amount,
        type,
      };

      this.logger.log(`Transação extraída: ${JSON.stringify(transaction)}`);
      transactions.push(transaction);
    }

    if (transactions.length === 0) {
      return [{
        date: '',
        description: '',
        amount: 0,
        type: '',
        message: 'Nenhuma transação encontrada.'
      }];
    }

    return transactions;
  }
}
