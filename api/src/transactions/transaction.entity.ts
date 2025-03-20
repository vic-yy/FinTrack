import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ type: 'date' })
  date: Date | undefined;

  @Column()
  description: string | undefined;

  @Column('float')
  amount: number | undefined;

  @Column({ nullable: true })
  category: string | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;
}
