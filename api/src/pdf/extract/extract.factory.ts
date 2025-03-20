import { CreditCardExtractor } from './credit/extract-credit.service';
import { DebitCardExtractor } from './debit/extract-debit.service';
import { Transaction } from './abstract-extractor';

/**
 * Função que detecta o tipo de extrato e retorna as transações extraídas.
 * Se o texto contiver indicadores de cartão de crédito, usa o CreditCardExtractor;
 * se contiver indicadores de cartão de débito, usa o DebitCardExtractor.
 * 
 * @param text Texto extraído do PDF.
 * @returns Array de transações.
 */
export function extractTransactions(text: string): Transaction[] {
  // Lógica de detecção – pode ser ajustada conforme o padrão dos seus extratos.
  const isCredit = text.includes('crédito') || text.includes('fatura');
  const isDebit = text.includes('débito') || text.includes('Compra no débito');

  let extractor;
  if (isCredit) {
    extractor = new CreditCardExtractor();
  } else if (isDebit) {
    extractor = new DebitCardExtractor();
  } else {
    throw new Error('Tipo de extrato não reconhecido');
  }

  return extractor.extractTransactions(text);
}
