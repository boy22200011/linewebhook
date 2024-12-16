import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { JwtStrategy } from "./jwt.strategy"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { CryptoModule } from "../../common/crypto/crypto.module"
import { CryptoService } from "../../common/crypto/crypto.service"
@Module({
  imports: [
    CryptoModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CryptoService],
  exports: [AuthService]
})
export class AuthModule {}
