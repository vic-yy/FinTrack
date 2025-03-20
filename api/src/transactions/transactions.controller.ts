import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactions() {
    return await this.transactionsService.getAllTransactions();
  }

  @Get('/filter')
  async getTransactionsByUserAndDate(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.transactionsService.getTransactionsByUserAndDate(userId, startDate, endDate);
  }

  @Post()
  async createTransaction(@Body() transactionData: Partial<Transaction>) {
    return await this.transactionsService.createTransaction(transactionData);
  }
}
