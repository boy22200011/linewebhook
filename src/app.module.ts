// core
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

// common
import { MomentModule } from "./common/momnet/moment.module"
import { AxiosModule } from "./common/axios/axios.module"
import { LodashModule } from "./common/lodash/lodash.module"
import { KnexModule } from "./common/knex/knex.module"

// api modules
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
@Module({
  imports: [
    // api modules
    AuthModule,
    UsersModule,
    // common modules
    MomentModule,
    AxiosModule,
    LodashModule,
    KnexModule,
    // environment modules
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || "development"}`, ".env"],
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
