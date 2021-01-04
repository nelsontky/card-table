import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import "./lib/firebase";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  await app.listen(5001);
}
bootstrap();
