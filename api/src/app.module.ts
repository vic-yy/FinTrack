import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadsPDFModule } from './pdf/uploads/uploads.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsCSVModule } from './csv/upload/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UploadsPDFModule,
    UploadsCSVModule,
    PrismaModule,  
  ],
})
export class AppModule {}
