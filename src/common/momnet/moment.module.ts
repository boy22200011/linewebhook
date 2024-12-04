import { MomentService } from "./moment.service"
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common"

@Module({
  imports: [],
  controllers: [],
  providers: [MomentService],
  exports: [MomentService]
})
export class MomentModule {}
