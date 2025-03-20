import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { PrismaService } from '../../prisma/prisma.service'; 
import { CategoryModule } from '../../category/category.module'; 

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    CategoryModule, 
  ],
  controllers: [UploadsController],
  providers: [UploadsService, PrismaService], 
  exports: [UploadsService], 
})
export class UploadsPDFModule {}
