/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common"

import * as crypto from "crypto"
@Injectable()
export class CryptoService {
  private readonly algorithm = "aes-128-cbc"
  private readonly key = Buffer.from("mfPGvZURPaEACEKG") // 16 字節密鑰
  private readonly iv = Buffer.from("rp8F4M9TcTP3gQyg") // 16 字節初始向量

  constructor() {}

  // 使用 Base64 編碼加密結果
  encrypt(text: string): string {
    const cipher = crypto.createCipheriv("aes-128-cbc", this.key, this.iv)
    let encrypted = cipher.update(text, "utf8", "base64")
    encrypted += cipher.final("base64")
    return encrypted // 只返回加密數據
  }

  // 解密
  decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv("aes-128-cbc", this.key, this.iv)
    let decrypted = decipher.update(encrypted, "base64", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  }
}
