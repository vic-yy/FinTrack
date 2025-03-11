    import { Injectable } from '@nestjs/common';
    import { CardExtractor, CardExtractorOptions } from '../abstract-extractor';

    @Injectable()
    export class CreditCardExtractor extends CardExtractor {
    protected options: CardExtractorOptions = {
        // Regex para extrair datas no formato "DD MMM" (ex.: "03 MAR")
        regex: /(\d{2}\s[A-Z]{3})\s+(.*?)(-\s*)?R\$\s*([\d.,]+)/g,
        // Para cartão de crédito: se o valor for negativo, consideramos como "PAGAMENTO" (por exemplo, pagamento da fatura)
        typeMapping: (amount: number) => (amount < 0 ? 'PAYMENT' : 'EXPENSE'),
    };
    }
