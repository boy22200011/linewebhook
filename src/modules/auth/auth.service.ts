import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { JwtStrategy } from "./jwt.strategy"
import { CryptoService } from "../../common/crypto/crypto.service"
import { KnexService } from "../../common/knex/knex.service"
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
    private readonly cryptoService: CryptoService,
    private readonly knexSerivce: KnexService
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

  async getSerialNumber(serialNumberStr: string) {
    try {
      const knex = this.knexSerivce.getKnex()
      const dbData = await knex("SerialNumberList")
        .select({
          serialNumber: "SerialNumber",
          status: "Status"
        }) // Directly list column names instead of using an object
        .where("SerialNumber", serialNumberStr)
        .limit(1)
      if (dbData.length > 0) {
        return dbData[0] // Return the first row
      } else {
        throw new Error("找不到資料")
      }
    } catch (error) {
      console.error(error)
      throw new Error("資料庫異常")
    }
  }

  async genPPeId(info: {
    licencekey: string
    machineInfo: { machineId: string; cpuSerial: string; diskSerial: string }
  }) {
    // 將 info 轉換為 JSON 字串
    const jsonStr = JSON.stringify(info)

    // AES加密
    const encryptedKey = this.cryptoService.encrypt(jsonStr)

    // AES 解密
    // const decryptedKey = this._cryptoService.decrypt(encryptedKey)

    return {
      ppeid: encryptedKey
    }
  }
}
