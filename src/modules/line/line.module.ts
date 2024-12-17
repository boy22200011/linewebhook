import { Module } from "@nestjs/common"
import { LineService } from "./line.service"
import { LineController } from "./line.controller"
import { CryptoModule } from "../../common/crypto/crypto.module"
import { CryptoService } from "../../common/crypto/crypto.service"
import { KnexService } from "../../common/knex/knex.service"
@Module({
  imports: [CryptoModule],
  controllers: [LineController],
  providers: [LineService, CryptoService, KnexService]
})
export class LineModule {}
