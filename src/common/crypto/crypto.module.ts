import { CryptoService } from "./crypto.service"
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common"

@Module({
  imports: [],
  controllers: [],
  providers: [CryptoService]
})
export class CryptoModule {}
