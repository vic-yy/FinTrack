export class ProcessService {
    static processExtractedData(extractedData: any): any {
        if (!extractedData || !extractedData.transactions) {
            return { message: "Nenhuma transação encontrada.", transactions: [] };
        }

        const currentYear = new Date().getFullYear();

        const formattedTransactions = extractedData.transactions.map((transaction: any) => {
            const formattedDate = ProcessService.formatDate(transaction.date, currentYear);
            const formattedAmount = ProcessService.formatAmount(transaction.amount); // Agora mantém como número
            const type = formattedAmount < 0 ? "PAYMENT" : "EXPENSE";

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

    private static formatDate(dateString: string, year: number): string {
        const monthMap: { [key: string]: string } = {
            "JAN": "01", "FEV": "02", "MAR": "03", "ABR": "04",
            "MAI": "05", "JUN": "06", "JUL": "07", "AGO": "08",
            "SET": "09", "OUT": "10", "NOV": "11", "DEZ": "12"
        };

        const parts = dateString.split(" ");
        if (parts.length !== 2) return dateString;

        const day = parts[0].padStart(2, "0");
        const month = monthMap[parts[1].toUpperCase()];
        if (!month) return dateString;

        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate.toISOString().split("T")[0];
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
