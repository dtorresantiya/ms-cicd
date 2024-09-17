import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  await app.listen(envs.PORT, '0.0.0.0');
  console.log(`Server is running on ${envs.PORT} port`);
  
}
bootstrap();
