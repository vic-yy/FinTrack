import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { CategoryModule } from '../../category/category.module'; // 🔹 Importando CategoryModule
import { PrismaService } from '../../prisma/prisma.service'; // 🔹 Adicionando PrismaService

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    CategoryModule, // 🔹 Agora o módulo pode usar CategoryService
  ],
  controllers: [UploadsController],
  providers: [UploadsService, PrismaService], // 🔹 Adicionando PrismaService
  exports: [UploadsService],
})
export class UploadsCSVModule {}
