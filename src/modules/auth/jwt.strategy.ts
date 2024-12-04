import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JwtPayload } from "./interfaces/jwt-payload.interface"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 從 Authorization 標頭中提取 Bearer token
      secretOrKey: configService.get<string>("JWT_SECRET"), // 與生成 token 時的密鑰一致
      ignoreExpiration: false
    })
  }

  async validate(payload: JwtPayload): Promise<any> {
    // 這裡的 payload 是解密後的 JWT token 內容
    return { userId: payload.sub, username: payload.username }
  }
}
