import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const environment = process.env.NODE_ENV
  if (environment === "production") {
    // 生產環境的配置
    app.enableCors()
  } else {
    // 開發環境的配置
  }
  await app.listen(process.env.PORT ?? 5000)
  console.log(`Server listening on ${process.env.PORT}`)
}
bootstrap()
