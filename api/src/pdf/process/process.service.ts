export class ProcessService {
    static processExtractedData(extractedData: any): any {
        if (!extractedData || !extractedData.transactions) {
            return { message: "Nenhuma transação encontrada.", transactions: [] };
        }

        const currentYear = new Date().getFullYear();

        const formattedTransactions = extractedData.transactions.map((transaction: any) => {
            const formattedDate = ProcessService.formatDate(transaction.date, currentYear);
            const formattedAmount = ProcessService.formatAmount(transaction.amount); // Agora mantém como número
            const type = formattedAmount < 0 ? "PAGAMENTO" : "DESPESA";

            return {
                date: formattedDate,
                description: transaction.description.trim(),
                amount: formattedAmount, // Mantendo como número
                type
            };
        });

        return {
            message: extractedData.message,
            transactions: formattedTransactions
        };
    }

    private static formatDate(dateString: string, year: number): string | null {
        const monthMap: { [key: string]: string } = {
            "JAN": "01", "FEV": "02", "MAR": "03", "ABR": "04",
            "MAI": "05", "JUN": "06", "JUL": "07", "AGO": "08",
            "SET": "09", "OUT": "10", "NOV": "11", "DEZ": "12"
        };
    
        if (!dateString || typeof dateString !== "string") {
            console.warn(`⚠️ Data inválida detectada: "${dateString}". Retornando null.`);
            return null;
        }
    
        dateString = dateString.trim();
    
        // Se a data já estiver no formato "YYYY-MM-DD" ou "DD/MM/YYYY", apenas converter para ISO
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return new Date(dateString).toISOString().split("T")[0];
        }
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
            const [day, month, year] = dateString.split("/");
            return new Date(`${year}-${month}-${day}`).toISOString().split("T")[0];
        }
    
        // Se estiver no formato "DD MMM" (cartão de crédito), adicionar o ano e converter
        const parts = dateString.split(" ");
        if (parts.length === 2) {
            const day = parts[0].padStart(2, "0");
            const month = monthMap[parts[1].toUpperCase()];
            if (!month) {
                console.warn(`⚠️ Mês inválido detectado: "${parts[1]}". Retornando null.`);
                return null;
            }
    
            const formattedDateString = `${year}-${month}-${day}`;
            const formattedDate = new Date(formattedDateString);
    
            if (isNaN(formattedDate.getTime())) {
                console.warn(`⚠️ Erro ao converter data: "${formattedDateString}". Retornando null.`);
                return null;
            }
    
            return formattedDate.toISOString().split("T")[0];
        }
    
        console.warn(`⚠️ Formato de data desconhecido: "${dateString}". Retornando null.`);
        return null;
    }
    
    private static formatAmount(amount: any): number {
        if (typeof amount === "string") {
            amount = amount.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
        }

        const numericAmount = parseFloat(amount);

        if (isNaN(numericAmount)) {
            console.warn(`⚠️ Valor inválido detectado: "${amount}". Retornando 0.`);
            return 0;
        }

        return numericAmount; 
    }
}
