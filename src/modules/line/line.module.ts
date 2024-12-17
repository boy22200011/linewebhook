import { Module } from "@nestjs/common"
import { LineService } from "./line.service"
import { LineController } from "./line.controller"
import { CryptoModule } from "../../common/crypto/crypto.module"
import { CryptoService } from "../../common/crypto/crypto.service"
@Module({
  imports: [CryptoModule],
  controllers: [LineController],
  providers: [LineService, CryptoService]
})
export class LineModule {}
