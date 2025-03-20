import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../entities/transaction.entity';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactions() {
    return await this.transactionsService.getAllTransactions();
  }

  @Get('/filter')
  async getTransactionsByUserAndDate(@Query() filterDto: FilterTransactionsDto) {
    return await this.transactionsService.getTransactionsByUserAndDate(filterDto);
  }
  @Post()
  async createTransaction(@Body() transactionData: Partial<Transaction>) {
    return await this.transactionsService.createTransaction(transactionData);
  }

  @Get('/with-category')
  async getAllTransactionsWithCategory() {
    return await this.transactionsService.getAllTransactionsWithCategory();
  }
}
