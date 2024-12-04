import { LodashService } from "./lodash.service"
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common"

@Module({
  imports: [],
  controllers: [],
  providers: [LodashService],
  exports: [LodashService]
})
export class LodashModule {}
