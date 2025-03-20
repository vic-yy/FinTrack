import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async createTransaction(transactionData: Partial<Transaction>) {
    const transaction = this.transactionsRepository.create(transactionData);
    return await this.transactionsRepository.save(transaction);
  }

  async getAllTransactions() {
    return await this.transactionsRepository.find();
  }

  async getTransactionsByUserAndDate(userId: string, startDate: string, endDate: string) {
    return await this.transactionsRepository.find({
      where: {
        date: Between(new Date(startDate), new Date(endDate)),
      },
    });
  }
}
