import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
  .setTitle('Abgail')
  .setDescription('Projeto CRM')
  .setContact("Projeto Integrador. ","Nosso GitHub: ", "https://github.com/Grupo-05-Turma-JavaScript-11/crm-backend")
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
  
  process.env.TZ = 'America/Sao_Paulo';
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3030);

}
bootstrap();
