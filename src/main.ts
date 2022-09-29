import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common";

async function start() {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, {
      logger: ["log"]
    });

    app.useGlobalPipes(new ValidationPipe())

    app.use(cookieParser());
    app.enableCors({
      origin: process.env.FRONT_URL,
      credentials: true
    })

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
  } catch (e) {
    console.log(e);
  }
}
start();
