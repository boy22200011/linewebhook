import { Injectable } from "@nestjs/common"

import { JwtService } from "@nestjs/jwt"

import { JwtStrategy } from "./jwt.strategy"

import { CryptoService } from "../../common/crypto/crypto.service"
@Injectable()
export class AuthService {
  private _cryptoService
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
    private readonly cryptoService: CryptoService
  ) {
    this._cryptoService = cryptoService
  }
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

  async genPPeId(info: {
    licencekey: string
    machineInfo: { machineId: string; cpuSerial: string; diskSerial: string }
  }) {
    // 將 info 轉換為 JSON 字串
    const jsonStr = JSON.stringify(info)

    // AES加密
    const encryptedKey = this._cryptoService.encrypt(jsonStr)

    // AES 解密
    // const decryptedKey = this._cryptoService.decrypt(encryptedKey)

    return {
      ppeid: encryptedKey
    }
  }
}
