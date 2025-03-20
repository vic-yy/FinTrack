import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])], // 🔹 Garante que a entidade Transaction está disponível
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService], // 🔹 Permite que o serviço seja utilizado em outros módulos
})
export class TransactionsModule {}
