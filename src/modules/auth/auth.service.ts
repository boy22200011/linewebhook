import { Injectable } from "@nestjs/common"

import { JwtService } from "@nestjs/jwt"

import { JwtStrategy } from "./jwt.strategy"
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy
  ) {}
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async getTokenData(jwtToken: any) {
    try {
      // 解密
      const decoded = await this.jwtService.verifyAsync(jwtToken)
      return await this.jwtStrategy.validate(decoded)
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`)
    }
  }
}
