import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';
import { Category } from '../../category/entity/category.entity';

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

  async getTransactionsByUserAndDate(filterDto: FilterTransactionsDto) {
    return await this.transactionsRepository.find({
      where: {
        date: Between(
          new Date(filterDto.startDate ?? '1970-01-01'),
          new Date(filterDto.endDate ?? '2100-01-01'),
        ),
      },
    });
  }
  async getAllTransactionsWithCategory() {
    return await this.transactionsRepository.find({
      relations: ['category'], // ✅ Buscar com a relação de categoria
    });
  }
  
}
