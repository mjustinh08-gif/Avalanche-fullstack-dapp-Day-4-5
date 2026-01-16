import 'dotenv/config'; // Baris pertama ini wajib di atas sendiri
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- MODIFIKASI IDENTITAS ---
  const config = new DocumentBuilder()
    .setTitle('Block Explorer Mini - Muhammad Justin Hendarta - NIM:241011402830') 
    .setDescription('Backend API untuk berinteraksi dengan Smart Contract SimpleStorage di Avalanche Fuji')
    .setVersion('2.0') 
    .addTag('Blockchain Operations')
    .build();
  // ---------------------------

  const document = SwaggerModule.createDocument(app, config);
  
  // Setup documentation path
  SwaggerModule.setup('documentation', app, document);

  // Menggunakan port dari .env (opsional) atau default 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Server berjalan di http://localhost:${port}/documentation`);
}
bootstrap();