import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // WAJIB: Biar Frontend bisa akses API ini
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Block Explorer Mini - Justin')
    .setDescription('Backend API untuk dApp Avalanche')
    .setVersion('2.0')
    .addTag('Blockchain')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  // WAJIB: Biar bisa jalan di Cloud (Railway)
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); 
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();