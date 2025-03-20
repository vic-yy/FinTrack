import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import type { Express } from 'express'; // Use "type" para evitar conflito de tipos

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(@UploadedFile() file?: Express.Multer.File) {
    console.log('Nome:', file?.originalname);
    console.log('Tipo:', file?.mimetype);
    console.log('Tamanho (bytes):', file?.size);
  
    if (!file) {
      return { message: 'Nenhum arquivo enviado' };
    }
  
    return this.uploadsService.processPDF(file, 1);
  }
  
}
