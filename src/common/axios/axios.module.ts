import { AxiosService } from "./axios.service"
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AxiosService],
  exports: [AxiosService]
})
export class AxiosModule {}
