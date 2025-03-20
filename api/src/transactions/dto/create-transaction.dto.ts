export class CreateTransactionDto {
    date?: string; 
    description?: string;
    amount?: number;
    categoryId?: string; // ✅ Altere para categoryId
  }
  