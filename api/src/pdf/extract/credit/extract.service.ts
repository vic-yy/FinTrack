export function extractTransactions(text: string) {
    const transactions = [];
    const transactionRegex = /(\d{2}\s[A-Z]{3})\s+(.*?)(-\s*)?R\$\s*([\d.,]+)/g;
  
    let match;
    while ((match = transactionRegex.exec(text)) !== null) {
      const rawDate = match[1].trim();
      const rawDescription = match[2].trim();
      let rawAmount = match[4].replace(/\./g, '').replace(',', '.'); // Corrige separadores decimais
      let amount = parseFloat(rawAmount);
  
      // Se houver o sinal de menos antes do número, tornar o amount negativo
      if (match[3]) {
        amount *= -1;
      }
  
      // Agora usa os valores do enum Prisma
      const type = amount < 0 ? "PAGAMENTO" : "DESPESA";
  
      transactions.push({
        date: rawDate,
        description: rawDescription,
        amount: amount,
        type: type,
      });
  
      console.log(`📋 Transação Extraída:`, { date: rawDate, description: rawDescription, amount, type });
    }
  
    return transactions.length > 0 ? transactions : [{ message: 'Nenhuma transação encontrada.' }];
  }
  