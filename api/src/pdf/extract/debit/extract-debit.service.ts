import { Injectable } from '@nestjs/common';
import { CardExtractor, CardExtractorOptions } from '../abstract-extractor';

@Injectable()
export class DebitCardExtractor extends CardExtractor {
  protected options: CardExtractorOptions = {
    // Se o formato do extrato for o mesmo, podemos usar a mesma regex
    regex: /(\d{2}\s[A-Z]{3})\s+(.*?)(-\s*)?R\$\s*([\d.,]+)/g,
    // Para cartão de débito, todas as transações podem ser classificadas como "DEBITO"
    typeMapping: (_: number) => 'DEBITO',
  };
}
