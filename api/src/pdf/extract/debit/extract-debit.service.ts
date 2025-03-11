import { Injectable, Logger } from '@nestjs/common';
import { CardExtractor, CardExtractorOptions, Transaction } from '../abstract-extractor';

@Injectable()
export class DebitCardExtractor extends CardExtractor {
  protected options: CardExtractorOptions = {
    // Regex para datas no formato "DD MMM" ou "DD MMM YYYY", descrição e valor (sem "R$")
    regex: /(\d{2}\s[A-Z]{3}(?:\s\d{4})?)\s+(.*?)([-+]\s*)?([\d.,]+)/g,
    // Para débito, todas as transações serão classificadas como "DEBITO"
    typeMapping: (_: number) => 'DEBITO',
  };

  // Método auxiliar para converter datas no formato "DD MMM [YYYY]" para "YYYY-MM-DD"
  private formatDate(dateStr: string): string {
    const parts = dateStr.split(' ');
    const monthMapping: { [key: string]: string } = {
      'JAN': '01',
      'FEB': '02',
      'MAR': '03',
      'APR': '04',
      'MAY': '05',
      'JUN': '06',
      'JUL': '07',
      'AUG': '08',
      'SEP': '09',
      'OCT': '10',
      'NOV': '11',
      'DEC': '12',
    };

    if (parts.length === 3) {
      // Ex: "01 JAN 2025"
      const [day, month, year] = parts;
      return `${year}-${monthMapping[month]}-${day}`;
    } else if (parts.length === 2) {
      // Se faltar o ano, assume o ano atual
      const [day, month] = parts;
      const year = new Date().getFullYear().toString();
      return `${year}-${monthMapping[month]}-${day}`;
    }
    return dateStr; // Caso não corresponda ao padrão esperado
  }

  // Sobrescreve o método para filtrar transações indesejadas e formatar a saída
  extractTransactions(text: string): Transaction[] {
    // Extrai as transações utilizando a lógica comum definida na classe abstrata
    const transactions = super.extractTransactions(text);

    // Filtra itens que contenham textos de totais ou cabeçalhos
    const filtered = transactions.filter(tx => {
      const lowerDesc = tx.description.toLowerCase();
      if (lowerDesc.includes('total de entradas') ||
          lowerDesc.includes('total de saídas') ||
          lowerDesc.includes('saldo final') ||
          lowerDesc.includes('saldo inicial') ||
          lowerDesc.includes('rendimento líquido')) {
        return false;
      }
      if (!tx.description.trim() || !tx.amount) {
        return false;
      }
      return true;
    });

    // Formata as datas das transações para o padrão ISO
    const formattedTransactions = filtered.map(tx => ({
      ...tx,
      date: this.formatDate(tx.date),
    }));

    // Retorna o resultado encapsulado na chave "transactions"
    return formattedTransactions.length > 0 
      ? formattedTransactions 
      : [{
          date: '',
          description: '',
          amount: 0,
          type: '',
          message: 'Nenhuma transação encontrada.'
        }];
  }
}
