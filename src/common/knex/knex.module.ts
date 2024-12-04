import { KnexService } from "./knex.service"
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common"

@Module({
  imports: [],
  controllers: [],
  providers: [KnexService],
  exports: [KnexService]
})
export class KnexModule {}
